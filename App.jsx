import React, { useState } from "react";
import { Alert } from "react-native";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";




function calculateCardGPA(course) {
  const percentage = Math.floor((course.marks / course.total) * 100);
  if (percentage >= 80) return '4.0';
  if (percentage < 50) return '0.0';
  return (((percentage - 49) / 30 * 3.0 + 0.9).toFixed(1));
}

export default function App() {
  const [courseNameFocus, setCourseNameFocus] = useState(false);
  const [creditsFocus, setCreditsFocus] = useState(false);
  const [marksFocus, setMarksFocus] = useState(false);
  const [totalFocus, setTotalFocus] = useState(false);
  const [editId, setEditId] = useState(null);

  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState("");
  const [marks, setMarks] = useState("");
  const [total, setTotal] = useState("");

  const [courses, setCourses] = useState([]);
  const [gpa, setGpa] = useState(null);
  const [calculated, setCalculated] = useState(false);

  const addCourse = () => {
    if (!courseName || !credits || !marks || !total) return;
    let marksNum = parseFloat(marks);
    let totalNum = parseFloat(total);
    let creditsNum = parseFloat(credits);

    if (editId) {
      // Update existing course in-place (preserve order, avoid duplicates)
      setCourses(courses.map((c) =>
        c.id === editId
          ? {
              ...c,
              name: courseName,
              credits: creditsNum,
              marks: marksNum,
              total: totalNum,
            }
          : c
      ));
      setEditId(null);
    } else {
      const newCourse = {
        id: Date.now().toString(),
        name: courseName,
        credits: creditsNum,
        marks: marksNum,
        total: totalNum,
      };
      setCourses([...courses, newCourse]);
    }
    setCourseName("");
    setCalculated(false);
    setGpa(null);
  };

  const removeCourse = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
    setCalculated(false);
    setGpa(null);
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      const percentage = Math.floor((course.marks / course.total) * 100);
      
      if (percentage >= 80)
        totalPoints += 4.0 * course.credits
      else if (percentage < 50)
        totalPoints += 0.0 * course.credits
      else
        totalPoints += ((percentage - 49) / 30 * 3.0 + 0.9) * course.credits
      
      // total credits
      totalCredits += course.credits;
    });

    const result = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setGpa(result.toFixed(2));
    setCalculated(true);
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.navBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('./assets/logos/app-logo.png')} style={styles.navLogo} />
          <Text style={styles.navBarTitle}>SGPA Calculator</Text>
        </View>
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.inputGroupBox}>
          <TextInput
            style={[
              styles.input,
              courseNameFocus && { borderWidth: 1, borderColor: '#137fec' }
            ]}
            placeholder="Course Name"
            value={courseName}
            placeholderTextColor="#bfc6d1"
            onChangeText={setCourseName}
            onFocus={() => setCourseNameFocus(true)}
            onBlur={() => setCourseNameFocus(false)}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                styles.inputSmall,
                creditsFocus && { borderWidth: 1, borderColor: '#137fec' }
              ]}
              placeholder="Credits"
              value={credits}
              placeholderTextColor="#bfc6d1"
              onChangeText={val => {
                let num = val.replace(/[^0-9.]/g, "");
                setCredits(num);
              }}
              keyboardType="numeric"
              onFocus={() => setCreditsFocus(true)}
              onBlur={() => setCreditsFocus(false)}
            />
            <TextInput
              style={[
                styles.input,
                styles.inputSmall,
                marksFocus && { borderWidth: 1, borderColor: '#137fec' }
              ]}
              placeholder="Marks"
              value={marks}
              placeholderTextColor="#bfc6d1"
              onChangeText={val => {
                let num = val.replace(/[^0-9.]/g, "");
                setMarks(num);
              }}
              keyboardType="numeric"
              onFocus={() => setMarksFocus(true)}
              onBlur={() => setMarksFocus(false)}
            />
            <TextInput
              style={[
                styles.input,
                styles.inputSmall,
                totalFocus && { borderWidth: 1, borderColor: '#137fec' }
              ]}
              placeholder="Total: 100"
              value={total}
              placeholderTextColor="#bfc6d1"
              onChangeText={val => {
                let num = val.replace(/[^0-9.]/g, "");
                setTotal(num);
              }}
              keyboardType="numeric"
              onFocus={() => setTotalFocus(true)}
              onBlur={() => setTotalFocus(false)}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={addCourse}>
            <Text style={styles.addButtonText}>＋ Add Course</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={editId ? courses.filter((c) => c.id !== editId) : courses}
          keyExtractor={(item) => item.id}
          style={styles.courseList}
          renderItem={({ item }) => (
            <View style={styles.subjectCard}>
              <View style={styles.subjectIconBox}>
                <Image source={require('./assets/logos/course-logo.png')} style={styles.courseLogo} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.subjectTitle}>{item.name}</Text>
                <Text style={styles.subjectDetails}>Credits: {item.credits} | Marks: {item.marks}/{item.total}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.editButton} onPress={() => {
                    setCourseName(item.name);
                    setCredits(item.credits.toString());
                    setMarks(item.marks.toString());
                    setTotal(item.total.toString());
                    setEditId(item.id);
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image source={require('./assets/logos/edit-logo.png')} style={styles.actionLogo} />
                      <Text style={styles.editButtonText}>Edit</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => removeCourse(item.id)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image source={require('./assets/logos/delete-logo.png')} style={styles.actionLogo} />
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.gpaBadgeBox}>
                <Text style={styles.gpaBadgeValue}>GPA: {calculateCardGPA(item)}</Text>
              </View>
            </View>
          )}
        />

        {gpa && (
          <View style={styles.gpaBox}>
            <Text style={styles.gpaLabel}>Your Calculated GPA</Text>
            <Text style={styles.gpaValue}>{gpa}</Text>
          </View>
        )}

        {courses.length > 1 ? (
          !calculated ? (
            <TouchableOpacity style={styles.calcButton} onPress={calculateGPA}>
              <Text style={styles.calcButtonText}>Calculate GPA</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.calcButton, { backgroundColor: "#137fec" }]}
              onPress={() => setCalculated(false)}
            >
              <Text style={styles.calcButtonText}>Edit</Text>
            </TouchableOpacity>
          )
        ) : (
          <Text style={styles.secondaryText}>
            Add minimum 3 courses to calculate GPA
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e6eaf0',
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  subjectIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#e3efff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginRight: 0,
  },
  courseLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  actionLogo: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  navLogo: {
    width: 32,
    height: 32,
    marginRight: 10,
    resizeMode: 'contain',
  },
  subjectTitle: {
    fontWeight: 'bold',
    fontSize: 16.5,
    color: '#222',
    marginBottom: 2,
  },
  subjectDetails: {
    color: '#6d7b8a',
    fontSize: 13.5,
    marginBottom: 10,
  },
  gpaBadgeBox: {
    backgroundColor: '#e3efff',
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 10,
    marginRight: 2,
    marginTop: -40,
  },
  gpaBadgeValue: {
    color: '#137fec',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 2,
    paddingLeft: 100,
  },
  editButton: {
    backgroundColor: '#f5f7fa',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 13,
    marginRight: 8,
  },
  editButtonText: {
    color: '#6d7b8a',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: '#ffeaea',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 13,
  },
  deleteButtonText: {
    color: '#ff5a5f',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  navBar: {
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e6eaf0',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, 
    zIndex: 1000,
  },
  navBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#137fec',
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 90,
    maxHeight: '100vh',
    overflow: 'scroll',
  },
  cardContainer: {
    width: '95%',
    maxWidth: 370,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 6,
  },
  inputGroupBox: {
    backgroundColor: '#f6f8fa',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#137fec',
    padding: 14,
    marginBottom: 18,
    shadowColor: '#137fec',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6eaf0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#222',
    marginBottom: 10,
    height: 40,
  },
  inputSmall: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  addButton: {
    backgroundColor: '#e3efff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    marginTop: 2,
    marginBottom: 2,
  },
  addButtonText: {
    color: '#137fec',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  courseList: {
    maxHeight: 300,
    marginBottom: 8,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#e6eaf0',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  courseIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#e3efff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  courseIcon: {
    fontSize: 20,
    color: '#137fec',
    fontWeight: 'bold',
  },
  courseTitle: {
    fontWeight: 'bold',
    fontSize: 15.5,
    color: '#222',
    marginBottom: 2,
  },
  courseDetails: {
    color: '#6d7b8a',
    fontSize: 13.5,
  },
  removeButton: {
    fontSize: 22,
    color: '#bfc6d1',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  gpaBox: {
    backgroundColor: '#f6f8fa',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#137fec',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  gpaLabel: {
    color: '#6d7b8a',
    fontSize: 15,
    fontWeight: '500',
  },
  gpaValue: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#137fec',
    marginTop: 4,
    letterSpacing: 1,
  },
  calcButton: {
    backgroundColor: '#137fec',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    marginTop: 10,
    marginBottom: 2,
  },
  calcButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  secondaryText: {
    marginTop: 18,
    textAlign: 'center',
    color: '#bfc6d1',
    fontSize: 14,
    fontWeight: '500',
  },
});
