import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f2f2f2', // light grey background
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#C0C0C0', // silver color
    borderBottomWidth: 2,
    borderBottomColor: '#888', // darker underline
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#001f54', // navy blue
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  ageRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 15,
  width: '100%',
  backgroundColor: '#C0C0C0', // Same as other fields
  borderRadius: 5,
  paddingHorizontal: 10,
  height: 50,
},
ageLabel: {
  fontSize: 16,
  color: '#000',
},
agePickerWrapper: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
agePickerText: {
  fontSize: 16,
  color: '#000',
  textAlign: 'center',
},
hiddenPicker: {
  height: 0,
  width: 0,
  opacity: 0,
},


genderRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
  width: '100%',
  backgroundColor: '#C0C0C0', // same as input fields
  borderRadius: 5,
  paddingHorizontal: 10,
  height: 50,
},

genderLabel: {
  fontSize: 16,
  color: '#000',
},

genderOptionsWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  flex: 1,
},

radioOption: {
  flexDirection: 'row',
  alignItems: 'center',
},

radioCircle: {
  height: 20,
  width: 20,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#000',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 5,
},

selectedRadio: {
  backgroundColor: '#001f54', // navy blue for selected
},

radioLabel: {
  fontSize: 16,
  color: '#000',
},

errorText: {
  color: '#001f54', // navy blue
  fontSize: 14,
  marginBottom: 10,
  marginTop: -5,
},

 passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C0C0C0', // silver color to match other inputs
    borderBottomWidth: 2,
    borderBottomColor: '#888',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingVertical: 10,
  },
  eyeButton: {
    padding: 5,
  },
  eyeText: {
    color: '#001f54', // navy blue
    fontSize: 14,
    fontWeight: 'bold',
  },

  inputError: {
    borderBottomColor: 'red', 
    backgroundColor: '#FFE6E6', 
  },

});
