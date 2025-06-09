import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

import { styles } from "./style";
import ModalBiometrics from "../../components/common/modalBiometrics";

export default function SingUp() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");
  const [senha, setSenha] = useState("");
  const [cSenha, setCSenha] = useState("");

  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroNumero, setErroNumero] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroCSenha, setErroCSenha] = useState("");

  const [isSenhaVisible, setIsSenhaVisible] = useState(false);
  const [isCSenhaVisible, setIsCSenhaVisible] = useState(false);

  const navigation = useNavigation();

 const users = async () => {
  let hasError = false;

  // Validações (mantidas como já estão)
  if (nome.trim().split(" ").length < 2) {
    setErroNome("Digite seu nome e sobrenome");
    hasError = true;
  } else {
    setErroNome("");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setErroEmail("Digite um e-mail válido");
    hasError = true;
  } else {
    setErroEmail("");
  }

  if (numero.replace(/\D/g, "").length < 11) {
    setErroNumero("Digite o número com o DDD");
    hasError = true;
  } else {
    setErroNumero("");
  }

  if (senha.length < 8) {
    setErroSenha("A senha precisa ter no mínimo 8 caracteres");
    hasError = true;
  } else {
    setErroSenha("");
  }

  if (senha !== cSenha) {
    setErroCSenha("As senhas não coincidem!");
    hasError = true;
  } else {
    setErroCSenha("");
  }

  if (hasError) return;

  try {
    const response = await fetch('http://15.229.43.81:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: senha,
        name: nome,
        phone_number: numero,
      }),
    });

    let data;
const contentType = response.headers.get("content-type");

if (contentType && contentType.includes("application/json")) {
  data = await response.json();
} else {
  const text = await response.text();
  console.log("Erro texto da API:", text);
  throw new Error(text || "Erro inesperado do servidor.");
}

if (!response.ok) {
  console.log("Erro JSON da API:", data);
  throw new Error(data.message || "Erro ao registrar usuário");
}

    await AsyncStorage.setItem("authToken", data.idToken);
    await AsyncStorage.setItem("uid", data.uid);
    await AsyncStorage.setItem("loggedUserEmail", email);
    await AsyncStorage.setItem("loggedUserNome", nome);
    await AsyncStorage.setItem("loggedUserNumero", numero);

    setNome("");
    setEmail("");
    setNumero("");
    setSenha("");
    setCSenha("");

    openModal();

    setTimeout(() => {
      closeModal();
      navigation.navigate("avatarSelect");
    }, 1500);

  } catch (error) {
    Alert.alert("Erro no cadastro", error.message);
    console.error("Erro no cadastro:", error);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.cont}>
        <Text style={styles.txth1}>CADASTRO</Text>

        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.txtinput}
          placeholder="Ex: João Gabriel"
          value={nome}
          onChangeText={setNome}
        />
        <Text style={styles.txterro}>{erroNome}</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.txtinput}
          placeholder="example@example.com"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.txterro}>{erroEmail}</Text>

        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.txtinput}
          placeholder="(DDD) 9 NNNN-NNNN"
          keyboardType="numeric"
          value={numero}
          onChangeText={(text) => setNumero(text.replace(/[^0-9]/g, ''))}
          maxLength={11}
        />
        <Text style={styles.txterro}>{erroNumero}</Text>

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.txtinput}
          placeholder="* * * * * * * *"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!isCSenhaVisible}
          maxLength={8}
        />       
        <Text style={styles.txterro}>{erroSenha}</Text>

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.txtinput}
          placeholder="* * * * * * * *"
          value={cSenha}
          onChangeText={setCSenha}
          secureTextEntry={!isCSenhaVisible}
          maxLength={8}
        />
        <TouchableOpacity onPress={() => setIsCSenhaVisible(!isCSenhaVisible)}>
          <Text>{isCSenhaVisible ? "Ocultar senha" : "Ver senha"}</Text>
        </TouchableOpacity>
        <Text style={styles.txterro}>{erroCSenha}</Text>

        <TouchableOpacity style={styles.btn} onPress={users}>
          <Text style={styles.txtbtn}>CRIAR CONTA</Text>
        </TouchableOpacity>

        <ModalBiometrics visible={isModalVisible} onClose={closeModal} />
      </View>
    </View>
  );
}
