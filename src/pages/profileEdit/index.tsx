import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '../../pages/preferencesMenu/themeContext'; 
import getStyles from './style'; 
import ChevronLeftIcon from '../../assets/icons/ChevronLeft.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileEdit: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme); 
  const [originalEmail, setOriginalEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);

  const isEmailValid = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const isPhoneNumberValid = (text: string) => {
    const phoneRegex = /^\d{2}9\d{8}$/;
    return phoneRegex.test(text);
  };

  const isFullnameValid = (text: string) => {
    return text.length > 0;
  };

  const handleBackButton = () => {
    navigation.goBack();
    console.log('Voltar pressionado');
  };

const handleContinueButton = async () => {
  if (isEmailValid(email) && isFullnameValid(fullName) && isPhoneNumberValid(phoneNumber)) {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const response = await fetch('http://15.229.43.81:3000/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: fullName,
          phone_number: phoneNumber,
          picture: 'avatar_1'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        Alert.alert("Erro ao atualizar perfil", errorData.message || "Tente novamente.");
        return;
      }
      await AsyncStorage.setItem("loggedUserNome", fullName);
      await AsyncStorage.setItem("loggedUserNumero", phoneNumber);

      navigation.navigate('avatarEdit', {
        nomeCompleto: fullName,
        email: email,
        numero: phoneNumber,
      });

    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      Alert.alert("Erro interno", "Não foi possível atualizar o perfil.");
    }
  } else {
    setIsFormValid(false);
  }
};

  useEffect(() => {
  const carregarPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const response = await fetch('http://15.229.43.81:3000/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error("Erro ao buscar perfil:", await response.text());
        Alert.alert("Erro ao carregar perfil.");
        return;
      }

      const data = await response.json();
      setFullName(data.name);
      setEmail(data.email);
      setPhoneNumber(data.phone_number);
      
    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert("Erro", "Não foi possível carregar o perfil.");
    }
  };

  carregarPerfil();
}, []);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
          <Image source={ChevronLeftIcon} style={styles.backButtonIcon} />
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>
        <Text style={styles.titleHead}>EDIÇÃO DE PERFIL</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Digite seu nome completo"
        />
        {(!isFormValid && !isFullnameValid(fullName)) && <Text style={styles.errorText}>Error aqui</Text>}

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="example@example.com"
          keyboardType="email-address"
        />
        {(!isFormValid && !isEmailValid(email)) && <Text style={styles.errorText}>Error aqui</Text>}

        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="(DDD) 9 NNNN-NNNN"
          keyboardType="phone-pad"
          maxLength={11}
        />
        {(!isFormValid && !isPhoneNumberValid(phoneNumber)) && <Text style={styles.errorText}>Error aqui</Text>}
      </View>

      <TouchableOpacity onPress={handleContinueButton} style={styles.continueButton}>
        <Text style={styles.continueButtonText}>CONTINUAR</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileEdit;
