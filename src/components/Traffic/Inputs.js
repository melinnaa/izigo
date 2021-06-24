import React from 'react';

const Inputs = () => {
    return (
        <View style={styles.inputsBoxContainer}>
            <Text style={styles.title}>Voir le traffic</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={line}
                    onChangeText={setLine}
                    placeholder="N° de ligne"
                    underlineColorAndroid="transparent"
                />
                <View style={styles.icon}>
                    <Ionicons name="search-outline" size={15} color="#959595" />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={station}
                    onChangeText={setStation}
                    placeholder="Nom de la station"
                    underlineColorAndroid="transparent"
                />
                <View style={styles.icon}>
                    <Ionicons name="search-outline" size={15} color="#959595" />
                </View>
            </View>
        </View>
    )
}