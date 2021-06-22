import React, { useState } from 'react'
import { StackActions } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Marker } from 'react-native-maps';
import Ionicons from "react-native-vector-icons/Ionicons";
import MapViewDirections from 'react-native-maps-directions';
import { useEffect } from 'react';
import firebase from './../../Firebase/firebase';
import '@firebase/firestore'

const Itinerary = ({navigation, route}) => {
	const [itinerary, setItinerary] = useState()
	const [isFavorite, setIsFavorite] = useState(route.params.isFavorite)
	const [paths, setPaths] = useState();
	const [markers, setMarkers] = useState();

	const db = firebase.firestore();
	const user = firebase.auth().currentUser

	useEffect(() => {
		if (!itinerary){
			const iti = route.params.itinerary
			const sections = JSON.parse(iti.sections)
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
		if (!paths){
			fetchCoordinates();
		}
	}, []);
	
	const fetchCoordinates = () => {
		const allPaths = new Array();
		const sections = JSON.parse(route.params.itinerary.sections);

		for (var i=0; i<sections.length; i++){
			const section = sections[i];
			if (section.type === "public_transport"){
				const coords = [];
				const stop_points = [];
				const stop_date_times = section.stop_date_times;

				//The loop fill coords and stop points for each section 
				for (var j=0; j<stop_date_times.length; j++){
					coords[j] = {latitude: parseFloat(stop_date_times[j].stop_point.coord.lat), longitude: parseFloat(stop_date_times[j].stop_point.coord.lon)};
					stop_points[j] = stop_date_times[j].stop_point.name
				}

				const currPath = {type: "public_transport", coords: coords, stop_points: stop_points, color: section.display_informations.color};
				allPaths.push(currPath);
			}

			else if (section.type === "street_network"){
				const coords = [];
				const coordinates = section.geojson.coordinates
				let index = 0
				for (var j=0; j<coordinates.length; j+=3){
					coords[index] = {latitude: parseFloat(coordinates[j][0]), longitude: parseFloat(coordinates[j][1])};
					index++
				}
			
				const currPath = {type: "street_network", coords: coords}
				allPaths.push(currPath);
			}
		}
		setPaths(allPaths);
		setMarkers({
			departure: {latitude: route.params.itinerary.departure.latitude, longitude: route.params.itinerary.departure.longitude},
			arrival: {latitude: route.params.itinerary.arrival.latitude, longitude: route.params.itinerary.arrival.longitude}
		})
	}

	const toggleFavorite = () => {
		if (user && !isFavorite){
			addFavorite();
		}

		else if (user && isFavorite){
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
		db.collection("Courses")
		.doc(itinerary.id)
		.set({
			departure: itinerary.departure,
			arrival: itinerary.arrival,
			timeOfCourse: itinerary.duration,
			timeOfDeparture: itinerary.timeOfDeparture,
			timeOfArrival: itinerary.timeOfArrival,
			sections: JSON.stringify(itinerary.sections),
			idUser: user.uid
		})
		.then((docRef) => {
			console.log("course added in the db !")
			setIsFavorite(true);
		})
		.catch((error) => {
			console.log("Error adding document: ", error)
		})
	}

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

	return (
		<ScrollView style={styles.container}>
			<View style={styles.arrowIcon}>
				<TouchableOpacity onPress={()=> showList()}>
					<Ionicons name="arrow-back-circle" size={45} color="#FE596F"/>
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
							<MapViewDirections
								origin={path.coords[0]}
								waypoints={path.coords}
								destination={path.coords[path.coords.length-1]}
								apikey={'AIzaSyC7nSp83OyKXsEQ991GVi99QpmrHORt-CY'}
								strokeColor={"black"}
								strokeWidth={4}
								optimizeWaypoints={true}
							/>);
						}
						else if (path.type === "public_transport") {
							return (
							<MapViewDirections
								origin={path.coords[0]}
								waypoints={path.coords}
								destination={path.coords[path.coords.length-1]}
								apikey={'AIzaSyC7nSp83OyKXsEQ991GVi99QpmrHORt-CY'}
								strokeColor={"#"+path.color}
								strokeWidth={4}
							/>);
						}
					}
					)} 
					<Marker
						key={1}
						coordinate={markers.departure}
						title={itinerary.departure.name}
						description={"Départ"}>
						<Image source={require('../../assets/icon.png')} style={{height: 45, width: 35 }} />
					</Marker>
					<Marker
						key={2}
						coordinate={markers.arrival}
						title={itinerary.arrival.name}
						description={"Arrivée"}>
						<Image source={require('../../assets/map/pin.png')} style={{height: 27, width: 27 }} />
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
									<View style={styles.step}>
										<Text>
											{/* REMPLACER PAR DES ICONES */}
											{section.display_informations.commercial_mode}
											{section.display_informations.label}
										</Text>
										<View>
											<Text style={styles.step_separator}>
												{'>'}
											</Text>
										</View>
									</View>
								)
							}

							else if (section.type === "street_network"){
								return (
									<View style={styles.step}>
										<Ionicons name={"walk"} size={25} />
										<Text>
											{/* afficher le petit bonhomme + durée en secondes */}
											{Math.round(section.duration/60)} mn
											
										</Text>
										<View>
											<Text style={styles.step_separator}>
												{'>'}
											</Text>
										</View>
									</View>       
								)
							}						
						})}

					</View>
					<View style={styles.duration}>
						<Text style={styles.duration_number}>
							{itinerary.duration}
						</Text>
						<Text style={styles.duration_text}>
							min
						</Text>
					</View>
				</View>
			{itinerary.sections.map((section) => {
				if (section.type === "public_transport") {
					return (
						<View style={styles.section}>
							<View style={styles.pathContainer}>
								<View style={[styles.borderLeft, {backgroundColor: "#"+section.display_informations.color}]}>

								</View>
								<View style={styles.pathDetails}>
			
										<Text style={styles.stopPoint}> {section.from.stop_point.name} </Text>
									
										<View style={styles.direction}>
											<View>
												{section.display_informations.commercial_mode === "Bus" &&
												<Text style={[styles.busLabel, styles.transportLabel, {backgroundColor: "#"+section.display_informations.color}]}> {section.display_informations.label} </Text>
												}
												{section.display_informations.commercial_mode !== "Bus" &&
												<Text style={[styles.transportLabel]}> {section.display_informations.label} </Text>
												}
											</View>
											<Text style={styles.directionText}>{section.display_informations.direction} </Text>
										</View>
									<Text style={styles.stopPoint}> {section.to.stop_point.name} </Text>
								</View>
							</View>
							<View style={styles.statsContainer}>
								<View style={styles.sectionTime}>
									<Text>
										Temps de trajet:
									</Text>
									<Text style={styles.sectionTimetext}>
										{Math.round(section.duration/60)} min
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
										Marcher {Math.round(section.duration/60)} min (100 m)          
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
        flexDirection: "row",
        alignItems: 'baseline',
		flexWrap: 'wrap',
		width: '80%'
    },
    step: {
        flexDirection: "row",
        alignItems: 'baseline'
    },
    step_separator: {
        marginHorizontal: 10
    },
	duration: {
        flexDirection: "row",
        alignItems: 'baseline'
    },
    duration_number: {
        fontSize: 30,
		fontWeight: '500'
    },
    duration_text: {
        fontSize: 15,
		fontWeight: '500'
    },
	section: {
		flexDirection: "row" ,  
	},
	pathContainer: {
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	borderLeft: {
		width: 17,
		alignItems: 'center',
		paddingVertical: 20    
	},
	pathDetails: {
		marginLeft: 10,
		alignSelf: 'center',
		paddingVertical: 0,
		width: Dimensions.get('window').width*40/100,
	},
	direction: {
		flexDirection: "row",
		marginVertical: 45,
		width: '50%',
		alignItems: 'center'
	},
	directionText:{
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
	   borderRadius: 50
	},
	transportLabel: {
		marginRight: 10
	},
	map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height*50/100,
    },
	arrowIcon:{
        position:'absolute',
        display:"flex",
        top: 60,
        left: 15,
		zIndex:100
    },
})

export default Itinerary;