import React, { useEffect, useState } from 'react';
import {
  Text, View, Image, TextInput,
  KeyboardAvoidingView, TouchableOpacity,
  Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { styles } from './style';

export default function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isCSenhaVisible, setIsCSenhaVisible] = useState(false);   
  const navigation = useNavigation();
  const [rememberMe, setRememberMe] = useState(false);

const handleLogin = async () => {
  if (!email || !senha) {
    Alert.alert("Preencha todos os campos!");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    Alert.alert('Digite um e-mail válido');
    return;
  }
  if (senha.length < 8) {
    Alert.alert('A senha precisa ter no mínimo 8 caracteres');
    return;
  }

  try {
    const response = await fetch('http://15.229.43.81:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: senha })
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Erro no login", data.message || "Email ou senha incorretos.");
      return;
    }

    const token = data.id_token || data.authToken || data.idToken;
    if (!token) {
      Alert.alert("Erro", "Token de autenticação não recebido.");
      return;
    }  

    await AsyncStorage.setItem("authToken", token);
    await AsyncStorage.setItem("refresh_token", data.refresh_token || data.refreshToken || '');
    await AsyncStorage.setItem("loggedUserEmail", email);

    const profileResponse = await fetch("http://15.229.43.81:3000/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const profileData = await profileResponse.json();
    await AsyncStorage.setItem("loggedUserPicture", profileData.picture || '');
    navigation.navigate("Tab");

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    Alert.alert("Erro", "Erro interno ao tentar fazer login.");
  }
};


  


  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.containerLogo}>
        <Image
          source={require('../../assets/imgs/frame1.png')}
          style={styles.logoImage}
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry={!isCSenhaVisible}
          maxLength={8}
          autoCorrect={false}
          value={senha}
          onChangeText={setSenha}
        />
        
        <TouchableOpacity onPress={() => setIsCSenhaVisible(!isCSenhaVisible)}>
          <Text>Ver Senha</Text>
        </TouchableOpacity>

        
        {/* Checkbox personalizado */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={[
              styles.checkbox,
            ]}
          >
            {rememberMe && (
              <Text style={styles.checkboxCheckmark}>✓</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.namecheck}>Lembrar de mim</Text>
        </View>

        <TouchableOpacity style={styles.buttonEntrar} onPress={handleLogin}>
          <Text style={styles.textButtonWhite}>ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonCriar} onPress={() => navigation.navigate("SingUp")}>
          <Text style={styles.textButtonPurple}>CRIAR CONTA</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}