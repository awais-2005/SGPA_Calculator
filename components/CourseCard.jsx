import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

export default function CourseCard({ item, onEdit, onDelete, calculateCardGPA, styles, hideActions }) {
    return (
        <View style={styles.courseCardModern}>
            <View style={{ flex: 1, marginBottom: -6, paddingTop: 3 }}>
                <Text style={styles.courseTitleModern}>{item.name}</Text>
                <Text style={styles.courseDetailsModern}>Credits: {item.credits}, Marks: {item.marks}</Text>
            </View>
            <View style={styles.gpaRightBox}>
                <Text style={styles.gpaLabelModern}>GPA</Text>
                <Text style={styles.gpaValueModern}>{calculateCardGPA(item)}</Text>
            </View>
            {!hideActions && (
                <View style={styles.iconRowModern}>
                    <TouchableOpacity style={styles.iconButtonModern} onPress={onEdit}>
                        <Image source={require('../assets/logos/edit-logo.png')} style={styles.actionLogoModern} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButtonModern} onPress={onDelete}>
                        <Image source={require('../assets/logos/delete-logo.png')} style={styles.actionLogoModern} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
