import React from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import HTML from "react-native-render-html";

const htmlContent = `
<a class="twitter-timeline" href="https://twitter.com/T1_RATP?ref_src=twsrc%5Etfw">Tweets by T1_RATP</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
`;

const InfoTwitter = () => {
    const contentWidth = useWindowDimensions().width;
    return (
        <View>
            <HTML source={{ html: htmlContent }} contentWidth={contentWidth} />
        </View>  
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 1
    },
})

export default InfoTwitter;
