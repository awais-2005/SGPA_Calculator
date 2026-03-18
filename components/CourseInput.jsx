import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";

export default function CourseInput({
  courseName,
  credits,
  marks,
  setCourseName,
  setCredits,
  setMarks,
  courseNameFocus,
  setCourseNameFocus,
  creditsFocus,
  setCreditsFocus,
  marksFocus,
  setMarksFocus,
  addCourse,
  styles
}) {
  return (
    <View style={styles.inputGroupBox}>
      <Text style={styles.inputLabel}>Course Name</Text>
      <TextInput
        style={[
          styles.input,
          courseNameFocus && { borderWidth: 0.5, borderColor: '#ff6600' }
        ]}
        placeholder="e.g. Data Structures"
        value={courseName}
        placeholderTextColor="#6A6460"
        onChangeText={setCourseName}
        onFocus={() => setCourseNameFocus(true)}
        onBlur={() => setCourseNameFocus(false)}
      />
      <View style={styles.inputRow}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={styles.inputLabel}>Credits</Text>
          <TextInput
            style={[
              styles.input,
              styles.inputSmall,
              creditsFocus && { borderWidth: 0.5, borderColor: '#ff6600' }
            ]}
            placeholder="e.g. 3"
            value={credits}
            placeholderTextColor="#6A6460"
            onChangeText={val => {
              let num = val.replace(/[^0-9.]/g, "");
              setCredits(num);
            }}
            keyboardType="numeric"
            onFocus={() => setCreditsFocus(true)}
            onBlur={() => setCreditsFocus(false)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>Marks</Text>
          <TextInput
            style={[
              styles.input,
              styles.inputSmall,
              marksFocus && { borderWidth: 0.5, borderColor: '#ff6600' }
            ]}
            placeholder="e.g. 88"
            value={marks}
            placeholderTextColor="#6A6460"
            onChangeText={val => {
              let num = val.replace(/[^0-9.]/g, "");
              setMarks(num);
            }}
            keyboardType="numeric"
            onFocus={() => setMarksFocus(true)}
            onBlur={() => setMarksFocus(false)}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={addCourse}>
        <Text style={styles.addButtonText}>Add Course</Text>
      </TouchableOpacity>
    </View>
  );
}
