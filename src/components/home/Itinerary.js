import React, { useState } from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import MapView from 'react-native-maps';
import Ionicons from "react-native-vector-icons/Ionicons";
import MapViewDirections from 'react-native-maps-directions';
import { useEffect } from 'react';

const Itinerary = ({navigation, route}) => {
	const [itinerary, setItinerary] = useState(route.params.itinerary)
		//id
		//durée: "duration"
		//les différentes parties du parcours (metro, marche, etc): sections
		//heure de départ: "departure_date_time"
		//heure d'arrivée: "arrival_date_time"
	const [sectionsCoords, setSectionsCoords] = useState();

	useEffect(() => {
		if (!sectionsCoords){
			fetchCoordinates();
		}
	});
	
	const fetchCoordinates = () => {
		const coords = [];
		const sections = route.params.itinerary.sections

		for (var i=0; i<sections.length; i++){
			if (sections[i].type === "public_transport"){
				const section_coords = [];
				const stop_date_times = sections[i].stop_date_times;

				for (var j=0; j<stop_date_times.length; j++){
					section_coords[j] = {latitude: parseFloat(stop_date_times[j].stop_point.coord.lat), longitude: parseFloat(stop_date_times[j].stop_point.coord.lon)};
				}
				console.log(section_coords)
				coords[i] = section_coords;
			}
		}

		setSectionsCoords(coords);
	}

	return (
		<ScrollView style={styles.container}>
		
			{sectionsCoords &&
			<MapView 
				style={styles.map}
				provider={MapView.PROVIDER_GOOGLE}
				initialRegion={{
					latitude: 48.8534,
					longitude: 2.3488,
					latitudeDelta: 0.09,
					longitudeDelta: 0.04
				}}>
				{sectionsCoords.map((coords) => {
					<MapViewDirections
						origin={coords[0]}
						waypoints={coords}
						destination={coords[coords.length]}
						apikey={'AIzaSyC7nSp83OyKXsEQ991GVi99QpmrHORt-CY'}
						strokeColor="hotpink"
						strokeWidth={3}
						optimizeWaypoints={true}
					/>})
				}
			</MapView>
			}
			
			<View style={styles.detailsView}>
				<View style={styles.favIcon}>
					<Ionicons name={"heart-circle"} size={60} color={"#FE596F"} />
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
							{Math.round(itinerary.duration/60)}
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
	</ScrollView>
	)
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
})

export default Itinerary;