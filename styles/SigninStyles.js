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

hiddenPicker: {
  height: 0,
  width: 0,
  opacity: 0,
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

  inputError: {
    borderBottomColor:  '#888', 
    backgroundColor: '#C0C0C0'
  },

});
