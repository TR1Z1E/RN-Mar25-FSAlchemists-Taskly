import { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './style';
import { useNavigation } from '@react-navigation/native';

interface Avatar {
    id: number;
    imageUrl: string;
    borderColor: string;
}

const AvatarSelectionScreen: React.FC = () => {
    const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);
    const navigation = useNavigation();

    const avatars: Avatar[] = [
        {
            id: 1,
            imageUrl: 'https://desafi-03-jun.s3.sa-east-1.amazonaws.com/Ellipse+1.png',
            borderColor: '#5B3CC4',
        },
        {
            id: 2,
            imageUrl: 'https://desafi-03-jun.s3.sa-east-1.amazonaws.com/Ellipse+2.png',
            borderColor: '#E6E0F7',
        },
        {
            id: 3,
            imageUrl: 'https://desafi-03-jun.s3.sa-east-1.amazonaws.com/Ellipse+3.png',
            borderColor: '#32C25B',
        },
        {
            id: 4,
            imageUrl: 'https://desafi-03-jun.s3.sa-east-1.amazonaws.com/Ellipse+4.png',
            borderColor: '#E63946',
        },
        {
            id: 5,
            imageUrl:'https://desafi-03-jun.s3.sa-east-1.amazonaws.com/Ellipse+5.png',
            borderColor: '#B58B46',
        },
    ];


const handleAvatarPress = (id: number) => {
        setSelectedAvatarId(id);
    };

    const handleConfirmSelection = () => {
        if (selectedAvatarId) {
            console.log('Avatar selecionado: ', selectedAvatarId);
            navigation.navigate("Tab");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>SELECIONE SEU AVATAR</Text>
                <Text style={styles.subtitle}>(Escolha somente um.)</Text>
            </View>

            <View style={styles.avatarContainer}>
                {avatars.map((avatar) => (
                    <TouchableOpacity
                        key={avatar.id}
                        style={[
                            styles.avatarButton,
                            { borderColor: avatar.borderColor },
                        ]}
                        onPress={() => handleAvatarPress(avatar.id)}
                    >
                        <Image
                            source={{ uri: avatar.imageUrl }}
                            style={[
                                styles.avatarImage,
                                selectedAvatarId !== avatar.id && styles.deselectedAvatarImage,
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmSelection}
            >
                <Text style={styles.confirmButtonText}>CONFIRMAR SELEÇÃO</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AvatarSelectionScreen;