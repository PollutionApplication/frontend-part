import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Alert, PermissionsAndroid, Platform, Linking, TouchableOpacity, Image } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraStatus, setCameraStatus] = useState('Checking permissions...');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [cameraPosition, setCameraPosition] = useState('back');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const isFocused = useIsFocused();

  // Function to open app settings
  const openAppSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Error', 'Unable to open app settings');
    });
  };

  // Function to request permissions
  const requestCameraPermission = async () => {
    try {
      setCameraStatus('Requesting camera permission...');
      
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "This app needs access to your camera to scan items.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
          setCameraStatus('Permission granted. Initializing camera...');
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setCameraStatus('Permission permanently denied');
          Alert.alert(
            'Permissions Required',
            'Camera permission is permanently denied. Please enable it in app settings.',
            [
              { text: 'Open Settings', onPress: openAppSettings },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        } else {
          setHasPermission(false);
          setCameraStatus('Permission denied');
        }
      } else {
        // iOS permissions
        const cameraPermission = await Camera.requestCameraPermission();
        
        if (cameraPermission === 'authorized') {
          setHasPermission(true);
          setCameraStatus('Permission granted. Initializing camera...');
        } else if (cameraPermission === 'denied') {
          setCameraStatus('Permission denied');
          Alert.alert(
            'Permissions Required',
            'Camera permission is required to use this feature.',
            [
              { text: 'Open Settings', onPress: openAppSettings },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        } else {
          setHasPermission(false);
          setCameraStatus('Permission not granted');
        }
      }
    } catch (err) {
      console.warn('Permission error:', err);
      setHasPermission(false);
      setCameraStatus('Error requesting permission');
    }
  };

  // Effect to handle camera devices
  useEffect(() => {
    if (hasPermission) {
      console.log('Available devices:', devices);
      
      // Check if devices is an array (newer versions)
      if (Array.isArray(devices)) {
        const deviceList = devices.filter(device => device != null);
        setAvailableDevices(deviceList);
        
        if (deviceList.length > 0) {
          // Try to find the camera based on current position
          let device = deviceList.find(d => d.position === cameraPosition);
          
          // If not found, try the other position
          if (!device && cameraPosition === 'back') {
            device = deviceList.find(d => d.position === 'front');
            if (device) setCameraPosition('front');
          } else if (!device && cameraPosition === 'front') {
            device = deviceList.find(d => d.position === 'back');
            if (device) setCameraPosition('back');
          }
          
          // If still not found, use the first available device
          if (!device && deviceList.length > 0) {
            device = deviceList[0];
            setCameraPosition(device.position || 'unknown');
          }
          
          if (device) {
            setSelectedDevice(device);
            setCameraStatus(`${device.position || 'Camera'} selected`);
          } else {
            setSelectedDevice(null);
            setCameraStatus('No compatible camera devices found');
          }
        } else {
          setSelectedDevice(null);
          setCameraStatus('No camera devices available');
        }
      } 
      // Check if devices is an object with back/front properties (older versions)
      else if (devices && typeof devices === 'object') {
        const deviceList = [];
        
        if (devices.back) {
          deviceList.push({...devices.back, position: 'back'});
        }
        if (devices.front) {
          deviceList.push({...devices.front, position: 'front'});
        }
        
        setAvailableDevices(deviceList);
        
        if (deviceList.length > 0) {
          const device = deviceList.find(d => d.position === cameraPosition) || deviceList[0];
          if (device) {
            setSelectedDevice(device);
            setCameraPosition(device.position);
            setCameraStatus(`${device.position} camera selected`);
          }
        } else {
          setSelectedDevice(null);
          setCameraStatus('No camera devices available');
        }
      }
    }
  }, [devices, hasPermission, cameraPosition]);

  // Initial permission request
  useEffect(() => {
    requestCameraPermission();
  }, []);

  // Function to toggle camera position
  const toggleCamera = useCallback(() => {
    if (availableDevices.length > 1) {
      setCameraPosition(prevPosition => {
        const newPosition = prevPosition === 'back' ? 'front' : 'back';
        const newDevice = availableDevices.find(d => d.position === newPosition);
        
        if (newDevice) {
          setSelectedDevice(newDevice);
          setCameraStatus(`${newPosition} camera selected`);
          return newPosition;
        }
        
        return prevPosition;
      });
    } else if (availableDevices.length === 1) {
      Alert.alert('Info', 'Only one camera is available on this device');
    } else {
      Alert.alert('Error', 'No cameras available');
    }
  }, [availableDevices]);

  // Function to take a photo
  const takePhoto = async () => {
    if (cameraRef.current && !isTakingPhoto) {
      try {
        setIsTakingPhoto(true);
        const photo = await cameraRef.current.takePhoto({
          flash: 'off',
          enableShutterSound: false,
        });
        
        setCapturedPhoto(photo);
        console.log('Photo taken:', photo);
      } catch (error) {
        console.error('Failed to take photo:', error);
        Alert.alert('Error', 'Failed to take photo. Please try again.');
      } finally {
        setIsTakingPhoto(false);
      }
    }
  };

  // Function to retake photo (go back to camera view)
  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  // Function to save or use the photo
  const usePhoto = () => {
    if (capturedPhoto) {
      Alert.alert(
        'Photo Captured',
        'What would you like to do with this photo?',
        [
          {
            text: 'Use This Photo',
            onPress: () => {
              console.log('Using photo:', capturedPhoto.path);
              // Add your photo processing logic here
            }
          },
          {
            text: 'Retake',
            onPress: retakePhoto,
            style: 'cancel'
          },
          {
            text: 'Cancel',
            style: 'destructive'
          }
        ]
      );
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{cameraStatus}</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera: {cameraStatus}</Text>
        <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!selectedDevice) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{cameraStatus}</Text>
        <Text style={[styles.text, { fontSize: 14, marginTop: 10 }]}>
          Checking camera availability...
        </Text>
        <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If we have a captured photo, show the preview
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <Image 
          source={{ uri: `file://${capturedPhoto.path}` }} 
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
        />
        <View style={styles.previewControls}>
          <TouchableOpacity style={styles.controlButton} onPress={retakePhoto}>
            <Text style={styles.controlButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, styles.usePhotoButton]} onPress={usePhoto}>
            <Text style={styles.controlButtonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Main camera view
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={selectedDevice}
        isActive={isFocused && !capturedPhoto}
        photo={true}
      />
      <View style={styles.overlay}>
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>
        <Text style={styles.scanText}>Position the code within the frame</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Camera toggle button - show if we have multiple cameras */}
      {availableDevices.length > 1 && (
        <TouchableOpacity style={styles.toggleCameraButton} onPress={toggleCamera}>
          <Text style={styles.toggleButtonText}>
            Switch to {cameraPosition === 'back' ? 'Front' : 'Back'} Camera
          </Text>
        </TouchableOpacity>
      )}

      {/* Capture button */}
      <TouchableOpacity 
        style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]} 
        onPress={takePhoto}
        disabled={isTakingPhoto}
      >
        <View style={styles.captureButtonInner} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    padding: 10,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  toggleCameraButton: {
    position: 'absolute',
    bottom: 120,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    zIndex: 10,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#3498db',
  },
  cornerTopLeft: {
    top: -1,
    left: -1,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    top: -1,
    right: -1,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  previewControls: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
  },
  usePhotoButton: {
    backgroundColor: '#3498db',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});