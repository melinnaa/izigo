import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import HTML from "react-native-render-html";

const htmlContent = `
<a class="twitter-timeline" href="https://twitter.com/T1_RATP?ref_src=twsrc%5Etfw">Tweets by T1_RATP</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
`;

const LineInfo = ({ route }) => {
    const title = route.params;
    console.log(title)
    
    const contentWidth = useWindowDimensions().width;
    return (
        <View>
            <HTML source={{ html: htmlContent }} contentWidth={contentWidth} />
        </View>

    )
}


/*
const InfoTwitter = () => {
    
    /*
    const [search, setSearch] = useState("")
    const [listTweets, setListTweets] = useState([])

    const handleSubmit = () => {
        searchTweetAPI(search).then((result) => {
          console.log(result);
          setListTweets(result);
        });
    };

    useEffect(() => {
        const timeout = setTimeout(handleSubmit, 800)
        return () => {
            clearTimeout(timeout)
        }
    }, [search])

    return (
        <View><Text>Here comes twitter api !</Text></View>
    );

    useEffect(() => {
        fetch(
            ""
        ).then ((reponse) => {
            if (response.ok) {
                return reponse.json();
            }
        }).then(data => {
            console.log(data.results);
        })
    })
}*/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 1
    },
})

export default LineInfo;
