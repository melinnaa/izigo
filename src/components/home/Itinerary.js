import React, { useState } from 'react'
import { StackActions } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline} from 'react-native-maps'
import { Marker } from 'react-native-maps';
import Ionicons from "react-native-vector-icons/Ionicons";
import MapViewDirections from 'react-native-maps-directions';
import { useEffect } from 'react';
import firebase from './../../Firebase/firebase';
import '@firebase/firestore'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const Itinerary = ({ navigation, route }) => {
	const [itinerary, setItinerary] = useState();
	const [isFavorite, setIsFavorite] = useState(route.params.isFavorite)
	const [paths, setPaths] = useState();
	const [markers, setMarkers] = useState();

	const db = firebase.firestore();
	const user = firebase.auth().currentUser

	useEffect(() => {
		if (!itinerary) {
			const iti = route.params.itinerary
			const sections = JSON.parse(iti.sections);
			
			setItinerary({
				id: iti.id,
				departure: iti.departure,
				arrival: iti.arrival,
				duration: iti.duration,
				sections: sections,
				timeOfDeparture: iti.timeOfDeparture,
				timeOfArrival: iti.timeOfArrival
			})
		}
	}, [itinerary]);

	useEffect(() => {
		if (!paths) {
			fetchCoordinates();
		}
	}, []);

	const showResults = () => {
		const data = fetchData();
		Promise.resolve(data).then((response) => {
			const itineraries = new Array;
			const journeys = response.data.journeys
			for (var i = 0; i < journeys.length; i++) {
				itineraries.push(formatItinerary(journeys[i]));
			}
			setItineraries(itineraries);
			setIsShowingResults(true);
		})
    }

    const fetchData = async () => {
        try {
            const resp = await axios.get("https://api.navitia.io/v1/coverage/fr-idf/journeys?from=" + itinerary.departure.longitude + "%3B" + itinerary.departure.latitude + "&to=" + itinerary.arrival.longitude + "%3B" + itinerary.arrival.latitude + "&", {
                headers: {
                    'Authorization': `7a9c06ed-e0b6-4bc3-a7da-f27d4cbee972`,
                }
            })
            return resp

        } catch (err) {
            console.log(err.response);
            Alert.alert(
                "Pas d'itinéraire",
                "Aucun itinéraire n'a été trouvé",
                [
                    {
                        text: "OK"
                    }
                ]
            );
        }
    }

    const formatItinerary = (itinerary) => {

        return {
            id: guidGenerator(),
            departure: departure,
            arrival: arrival,
            duration: Math.round(itinerary.duration / 60), //in minutes
            sections: itinerary.sections,
            timeOfDeparture: convertDateTimeInTime(itinerary.departure_date_time), //format: HH:MM
            timeOfArrival: convertDateTimeInTime(itinerary.arrival_date_time), //format: HH:MM
        }
    }

    //convert YYYYMMDDTHHMMSS to HH:MM
    const convertDateTimeInTime = (dateTime) => {
        return dateTime.substr(-6).substr(0, 2) + ":" + dateTime.substr(-6).substr(2, 2);
    }

	const guidGenerator = () => {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

	const fetchCoordinates = () => {
		const allPaths = new Array();
		const sections = JSON.parse(route.params.itinerary.sections);

		for (var i = 0; i < sections.length; i++) {
			const section = sections[i];
			if (section.type === "public_transport") {
				const coords = [];
				const stop_points = [];
				const stop_date_times = section.stop_date_times;

				//The loop fill coords and stop points for each section 
				for (var j = 0; j < stop_date_times.length; j++) {
					coords[j] = { latitude: parseFloat(stop_date_times[j].stop_point.coord.lat), longitude: parseFloat(stop_date_times[j].stop_point.coord.lon) };
					stop_points[j] = stop_date_times[j].stop_point.name
				}

				const currPath = { type: "public_transport", coords: coords, stop_points: stop_points, color: section.display_informations.color };
				allPaths.push(currPath);
			}

			else if (section.type === "street_network") {
				const coords = [];
				const coordinates = section.geojson.coordinates
				let index = 0
				for (var j = 0; j < coordinates.length; j += 3) {
					coords[index] = { latitude: parseFloat(coordinates[j][0]), longitude: parseFloat(coordinates[j][1]) };
					index++
				}

				const currPath = { type: "street_network", coords: coords }
				allPaths.push(currPath);
			}
		}
		setPaths(allPaths);
		setMarkers({
			departure: { latitude: route.params.itinerary.departure.latitude, longitude: route.params.itinerary.departure.longitude },
			arrival: { latitude: route.params.itinerary.arrival.latitude, longitude: route.params.itinerary.arrival.longitude }
		})
	}

	const toggleFavorite = () => {
		if (user && !isFavorite) {
			addFavorite();
		}

		else if (user && isFavorite) {
			Alert.alert(
				"Supprimer",
				"Êtes-vous sûr(e) de supprimer l'itinéraire de vos favoris ?",
				[
					{
						text: "Annuler",
						style: "cancel"
					},
					{ text: "Oui", onPress: () => deleteFavorite() }
				],
				{ cancelable: false }
			);
		}

		else if (!user) {
			//login required to add in favorite
			navigation.navigate("AccountPage");
		}
	}

	// save the new fav itinerary in the database
	const addFavorite = () => {
		db.collection("Favorites")
			.doc(itinerary.id)
			.set({
				departure: itinerary.departure,
				arrival: itinerary.arrival,
				idUser: user.uid
			})
			.then((docRef) => {
				console.log("new favorite added in the db !")
				setIsFavorite(true);
			})
			.catch((error) => {
				console.log("Error adding document: ", error)
			})
	}
	// const addFavorite = () => {
	// 	db.collection("Courses")
	// 		.doc(itinerary.id)
	// 		.set({
	// 			departure: itinerary.departure,
	// 			arrival: itinerary.arrival,
	// 			timeOfCourse: itinerary.duration,
	// 			timeOfDeparture: itinerary.timeOfDeparture,
	// 			timeOfArrival: itinerary.timeOfArrival,
	// 			sections: JSON.stringify(itinerary.sections),
	// 			idUser: user.uid
	// 		})
	// 		.then((docRef) => {
	// 			console.log("course added in the db !")
	// 			setIsFavorite(true);
	// 		})
	// 		.catch((error) => {
	// 			console.log("Error adding document: ", error)
	// 		})
	// }

	const deleteFavorite = () => {
		console.log("delete")
		db.collection("Courses")
			.doc(itinerary.id)
			.delete()
			.then(() => {
				console.log("course deleted from db !")
				setIsFavorite(false);
			})
			.catch((error) => {
				console.log("Error deleting document: ", error)
			})
	}

	const showList = () => {
		navigation.dispatch(StackActions.pop(1))
	}

	const convertMinutesInHours = (num) => { 
        var hours = Math.floor(num / 60);  
        var minutes = num % 60;
        return hours + "h" + minutes;         
    }

	return (
		<ScrollView style={styles.container}>
			<View style={styles.arrowIcon}>
				<TouchableOpacity onPress={() => showList()}>
					<Ionicons name="arrow-back-circle" size={45} color="#FE596F" />
				</TouchableOpacity>
			</View>
			{itinerary && paths && markers &&
				<MapView
					style={styles.map}
					provider={PROVIDER_GOOGLE}
					initialRegion={{
						latitude: 48.8534,
						longitude: 2.3488,
						latitudeDelta: 0.09,
						longitudeDelta: 0.04
					}}>
					{paths.map((path) => {
						if (path.type === "street_network") {
							return (
								<Polyline
									coordinates={path.coords}
									strokeColor={"#B24112"}
									strokeWidth={4}
								/>
							);
						}
						else if (path.type === "public_transport") {
							return (
								<Polyline
									coordinates={path.coords}
									strokeColor={"#" + path.color}
									strokeWidth={4}
								/>
							);
						}
					}
					)}
					<Marker
						key={1}
						coordinate={markers.departure}
						title={itinerary.departure.name}
						description={"Départ"}>
						<Image source={require('../../assets/map/pin.png')} style={{ height: 27, width: 27 }} />
					</Marker>
					<Marker
						key={2}
						coordinate={markers.arrival}
						title={itinerary.arrival.name}
						description={"Arrivée"}>
						<Image source={require('../../assets/icon.png')} style={{ height: 45, width: 35 }} />
					</Marker>
				</MapView>
			}

			{itinerary &&
				<View style={styles.detailsView}>
					<View style={styles.favIcon}>
						<TouchableOpacity onPress={() => toggleFavorite()}>
							{!isFavorite &&
								<Ionicons name={"heart-circle"} size={60} color={"#FE596F"} />
							}
							{isFavorite &&
								<Ionicons name={"heart-circle-outline"} size={60} color={"#FE596F"} />
							}
						</TouchableOpacity>
					</View>
					<View style={styles.detailsViewHeader}>
						<View style={styles.schema}>
							{itinerary.sections.map((section) => {
								if (section.type === "public_transport") {
									return (
										<View style={{flexDirection: "row", alignItems: 'center'}}>
											<View style={[styles.step]}>                          
												{section.display_informations.commercial_mode == "RER" &&
													<Image source={{ uri: 'https://github.com/melinnaa/izigo/blob/main/src/assets/img/transports/rer/RER' + section.display_informations.label + '.png?raw=true' }} style={{ width: 20, height: 20, alignSelf: 'baseline',}} />
												}
												{section.display_informations.commercial_mode === "Bus" &&
													<Text style={[styles.busLabel, styles.transportLabel, { backgroundColor: "#" + section.display_informations.color, color: "#" + section.display_informations.text_color}]}> {section.display_informations.label} </Text>
												}
												{section.display_informations.commercial_mode === "Métro" &&
													<Image source={{ uri: 'https://github.com/melinnaa/izigo/blob/main/src/assets/img/transports/metro/Metro' + section.display_informations.label + '.png?raw=true' }} style={{ width: 20, height: 20}} />
												}
												{section.display_informations.commercial_mode === "Train" &&
													<Text style={[styles.busLabel, styles.transportLabel, { backgroundColor: "#" + section.display_informations.color, color: "#" + section.display_informations.text_color, width: 20, height: 20}]}> {section.display_informations.label} </Text>
												}
											</View>
											<View style={styles.step_separator}>
												<Ionicons name="radio-button-on" size={5} color="grey" />
											</View>
										</View>
									)
								}

								else if (section.type === "street_network") {
									return (
										<View>
											<View style={[styles.step]}>
												<Ionicons name={"walk"} size={25} />
												<Text>
													{/* afficher le petit bonhomme + durée en minutes */}
													{Math.round(section.duration / 60)} mn
												</Text>
												<View style={styles.step_separator}>
													<Ionicons name="radio-button-on" size={5} color="grey" />
												</View>
											</View>
										</View>
									)
								}
							})}

						</View>
						<View style={styles.duration}>
							<Text style={styles.duration_number}>
								{Math.round(itinerary.duration) >= 60 ? convertMinutesInHours(Math.round(itinerary.duration)) : Math.round(itinerary.duration)}
							</Text>
							<Text style={styles.duration_text}>
								min
							</Text>
						</View>
					</View>
					<View style={[styles.section, {marginTop: 20}]}>
						<View style={styles.pathContainer}>
							<View style={[styles.borderLeft]}>
								<View>
									<Image source={require('../../assets/map/pin.png')} style={{ height: 27, width: 27 }} />
								</View>
								<View>
									<Text>
										.
									</Text>
									<Text>
										.
									</Text>
								</View>
							</View>
							<View style={styles.locationLine}>
								<Text style={{ fontWeight: '500'}}>
									{itinerary.departure.name}
								</Text>
								<Text style={{ marginBottom: 10, fontWeight: '500'}}>
									Départ à {itinerary.timeOfDeparture}
								</Text>
							</View>
						</View>
					</View>
					{itinerary.sections.map((section) => {
						if (section.type === "public_transport") {
							return (
								<View style={styles.section}>
									<View style={styles.pathContainer}>
										<View style={[styles.borderLeft, { backgroundColor: "#" + section.display_informations.color }]}>
										</View>
										<View style={styles.pathDetails}>

											<Text style={styles.stopPoint}> {section.from.stop_point.name} </Text>
											<Text style={styles.stopPoint}> {convertDateTimeInTime(section.departure_date_time)}</Text>

											<View style={styles.direction}>
												<View>                     
													{section.display_informations.commercial_mode == "RER" &&
														<Image source={{ uri: 'https://github.com/melinnaa/izigo/blob/main/src/assets/img/transports/rer/RER' + section.display_informations.label + '.png?raw=true' }} style={{ width: 20, height: 20, alignSelf: 'baseline',}} />
													}
													{section.display_informations.commercial_mode === "Bus" &&
														<Text style={[styles.busLabel, styles.transportLabel, { backgroundColor: "#" + section.display_informations.color, color: "#" + section.display_informations.text_color}]}> {section.display_informations.label} </Text>
													}
													{section.display_informations.commercial_mode === "Métro" &&
														<Image source={{ uri: 'https://github.com/melinnaa/izigo/blob/main/src/assets/img/transports/metro/Metro' + section.display_informations.label + '.png?raw=true' }} style={{ width: 20, height: 20}} />
													}
													{section.display_informations.commercial_mode === "Train" &&
														<Text style={[styles.busLabel, styles.transportLabel, { backgroundColor: "#" + section.display_informations.color, color: "#" + section.display_informations.text_color, width: 20, height: 20}]}> {section.display_informations.label} </Text>
													}
												</View>
												<Text style={styles.directionText}>{section.display_informations.direction} </Text>
											</View>
											<Text style={styles.stopPoint}> {section.to.stop_point.name} </Text>
											<Text style={styles.stopPoint}> {convertDateTimeInTime(section.arrival_date_time)}</Text>
										</View>
									</View>
									<View style={styles.statsContainer}>
										<View style={styles.sectionTime}>
											<Text>
												Temps de trajet:
											</Text>
											<Text style={styles.sectionTimetext}>
												{Math.round(section.duration / 60)} min
											</Text>
										</View>
										<View>
											<Text>
												{section.stop_date_times.length} arrêts
											</Text>
										</View>
									</View>
								</View>
							)
						}

						else if (section.type === "street_network") {
							return (
								<View style={styles.section}>
									<View style={styles.pathContainer}>
										<View style={[styles.borderLeft]}>
											<View>
												<Text>
													.
												</Text>
											</View>
											<View>
												<Ionicons name={"walk"} size={25} />
											</View>
											<View>
												<Text>
													.
												</Text>
											</View>
										</View>
										<View style={styles.pathDetails}>
											<Text>
												Marcher {Math.round(section.duration / 60)} min (100 m)
											</Text>
										</View>
									</View>
								</View>
							)
						}

						else if (section.type === "transfer") {
							return (
								<View style={styles.section}>
									<View style={styles.pathContainer}>
										<View style={[styles.borderLeft]}>
											<View>
												<Text>
													.
												</Text>
											</View>
											<View>
												<Ionicons name={"walk"} size={25} />
											</View>
											<View>
												<Text>
													.
												</Text>
											</View>
										</View>
										<View style={styles.pathDetails}>
											<Text>
												Correspondance
											</Text>
										</View>
									</View>
								</View>
							)
						}

					})}
					<View style={styles.section}>
						<View style={styles.pathContainer}>
							<View style={[styles.borderLeft]}>
								<View>
									<Text>
										.
									</Text>
									<Text>
										.
									</Text>
								</View>
								<View>
									<Image source={require('../../assets/icon.png')} style={{ height: 45, width: 35 }} />
								</View>
							</View>
							<View style={styles.locationLine}>
								<Text style={{marginLeft: 10, marginTop: 10, fontWeight: '500'}}>
									{itinerary.arrival.name}
								</Text>
								<Text style={{marginLeft: 10, fontWeight: '500'}}>
									Arrivée à {itinerary.timeOfArrival}
								</Text>
							</View>
						</View>
					</View>
				</View>
			}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		margin: 1,
	},
	detailsView: {
		padding: 15,
		borderTopLeftRadius: 50,
		borderTopRightRadius: 50,
		backgroundColor: 'white',
		zIndex: 100,
		paddingBottom: 150
	},
	favIcon: {
		marginTop: -50,
		marginRight: 16,
		alignSelf: 'flex-end',
	},
	detailsViewHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 25,
		paddingTop: 5,
		paddingHorizontal: 15,
		borderBottomWidth: 0.6,
		borderBottomColor: 'grey'
	},
	schema: {
		width: 300,
		flexDirection: "row",
		flexWrap: 'wrap'
	},
	step: {
        flexDirection: "row",
        alignItems: 'center',
        alignSelf: 'center'
    },
    step_separator: {
        marginHorizontal: 4,
        alignSelf: 'center'
    },
	duration: {
		flexDirection: "row",
		alignItems: 'baseline',
		right: 20
	},
	duration_number: {
		fontSize: 30,
		fontWeight: '500'
	},
	duration_text: {
		fontSize: 15,
		fontWeight: '500',
	},
	section: {
		flexDirection: "row",
	},
	pathContainer: {
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	borderLeft: {
		width: 20,
		alignItems: 'center',
	},
	pathDetails: {
		marginLeft: 10,
		alignSelf: 'center',
		paddingVertical: 0,
		width: Dimensions.get('window').width * 40 / 100,
	},
	locationLine: {
		marginLeft: 15,
		alignSelf: 'center',
		paddingVertical: 0,
	},
	direction: {
		flexDirection: "row",
		marginVertical: 45,
		width: '50%',
		alignItems: 'center'
	},
	directionText: {
		marginLeft:10,
		fontWeight: '300',
		fontStyle: 'italic'
	},
	stopPoint: {
		width: '90%',
		fontWeight: '600'
	},
	statsContainer: {
		borderLeftWidth: 0.6,
		borderLeftColor: 'grey',
		paddingLeft: 30,
		justifyContent: 'center'
	},
	sectionTime: {
		flexDirection: 'row',
	},
	sectionTimetext: {
		fontWeight: '600',
		marginLeft: 5
	},
	busLabel: {
		borderRadius: 60
	},
	transportLabel: {
		marginRight: 10
	},
	map: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height * 50 / 100,
	},
	arrowIcon: {
		position: 'absolute',
		display: "flex",
		top: 60,
		left: 15,
		zIndex: 100,
		shadowOffset:{  width: 2,  height: 2,  },
        shadowColor: 'grey',
        shadowOpacity: 1.0,
        shadowRadius: 2,
	},
})

export default Itinerary;