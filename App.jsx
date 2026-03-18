import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CourseInput from "./components/CourseInput";
import CourseList from "./components/CourseList";
import ResultsCard from "./components/ResultsCard";




export default function App() {
  // GPA calculation helper
  function calculateCardGPA(course) {
    const percentage = Math.floor((course.marks / course.total) * 100);
    if (percentage >= 80) return '4.0';
    if (percentage < 50) return '0.0';
    return (((percentage - 49) / 30 * 3.0 + 0.9).toFixed(1));
  }

  // State hooks
  const [courseNameFocus, setCourseNameFocus] = useState(false);
  const [creditsFocus, setCreditsFocus] = useState(false);
  const [marksFocus, setMarksFocus] = useState(false);
  const [totalFocus, setTotalFocus] = useState(false);
  const [editId, setEditId] = useState(null);

  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState("");
  const [marks, setMarks] = useState("");
  // Total is always 100, no input needed
  const total = 100;

  const [courses, setCourses] = useState([]);
  const [gpa, setGpa] = useState(null);
  const [calculated, setCalculated] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);

  // Add or edit course
  const addCourse = () => {
    if (!courseName || !credits || !marks) return;
    let marksNum = parseFloat(marks);
    let creditsNum = parseFloat(credits);

    let updatedCourses;
    if (editId) {
      updatedCourses = courses.map((c) =>
        c.id === editId
          ? {
              ...c,
              name: courseName,
              credits: creditsNum,
              marks: marksNum,
              total: 100,
            }
          : c
      );
      setCourses(updatedCourses);
      setEditId(null);
    } else {
      const newCourse = {
        id: Date.now().toString(),
        name: courseName,
        credits: creditsNum,
        marks: marksNum,
        total: 100,
      };
      updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);
    }
    setCourseName("");
    setCredits("");
    setMarks("");
    // Reset calculated state and hide results when adding/editing a course
    setCalculated(false);
    setShowResults(false);
    setGpa(null);
  };

  // Remove course
  const removeCourse = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
    setCalculated(false);
    setGpa(null);
  };

  // Calculate GPA
  const calculateGPA = () => {
    let totalPoints = 0;
    let creditsSum = 0;
    let totalMarks = 0;
    let totalMax = 0;
    courses.forEach((course) => {
      const percentage = Math.floor((course.marks / course.total) * 100);
      if (percentage >= 80)
        totalPoints += 4.0 * course.credits;
      else if (percentage < 50)
        totalPoints += 0.0 * course.credits;
      else
        totalPoints += ((percentage - 49) / 30 * 3.0 + 0.9) * course.credits;
      creditsSum += course.credits;
      totalMarks += course.marks;
      totalMax += course.total;
    });

    const result = creditsSum > 0 ? totalPoints / creditsSum : 0;
    setGpa(result.toFixed(2));
    setCalculated(true);
    setShowResults(true);
    setTotalPercentage(totalMax > 0 ? Math.round((totalMarks / totalMax) * 100) : 0);
    setTotalCredits(creditsSum);
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.navBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* <Image source={require('./assets/logos/app-logo.png')} style={styles.navLogo} /> */}
          <Text style={styles.navBarTitle}>SGPA Calculator</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ alignItems: 'center', paddingTop: 90 }}>
        <View style={styles.cardContainer}>
          {!calculated && (
            <CourseInput
              courseName={courseName}
              credits={credits}
              marks={marks}
              setCourseName={setCourseName}
              setCredits={setCredits}
              setMarks={setMarks}
              courseNameFocus={courseNameFocus}
              setCourseNameFocus={setCourseNameFocus}
              creditsFocus={creditsFocus}
              setCreditsFocus={setCreditsFocus}
              marksFocus={marksFocus}
              setMarksFocus={setMarksFocus}
              addCourse={addCourse}
              styles={styles}
            />
          )}

          <Text style={styles.sectionHeader}>Courses</Text>

          <CourseList
            courses={courses}
            editId={editId}
            onEdit={(item) => {
              setCourseName(item.name);
              setCredits(item.credits.toString());
              setMarks(item.marks.toString());
              setEditId(item.id);
            }}
            onDelete={removeCourse}
            calculateCardGPA={calculateCardGPA}
            styles={styles}
            hideActions={calculated}
          />

          {courses.length > 1 ? (
            !calculated ? (
              <TouchableOpacity style={styles.calcButton} onPress={calculateGPA} activeOpacity={0.8}>
                <Text style={styles.calcButtonText}>Calculate</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.calcButton, { backgroundColor: "#ff6600" }]} onPress={() => { setCalculated(false); setShowResults(false); }} activeOpacity={0.8}>
                <Text style={styles.calcButtonText}>Edit</Text>
              </TouchableOpacity>
            )
          ) : (
            <Text style={styles.secondaryText}>
              Add minimum 2 courses to calculate GPA
            </Text>
          )}

          {showResults && (
            <ResultsCard
              totalPercentage={totalPercentage}
              gpa={gpa}
              totalCredits={totalCredits}
              styles={styles}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
// ...existing code...
}

const styles = StyleSheet.create({
  scrollContainer: {
    width: '100%',
    backgroundColor: '#201A17',
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#201A17',
    alignItems: 'center',
    minHeight: '100%',
  },
  navBar: {
    width: '100%',
    backgroundColor: '#201A17',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 30,
    borderBottomWidth: 0.3,
    borderBottomColor: '#ff6600',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navLogo: {
    width: 32,
    height: 32,
    marginRight: 10,
    resizeMode: 'contain',
  },
  navBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6600',
    letterSpacing: 0.5,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
  },
  inputGroupBox: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    paddingHorizontal: 18,
    paddingTop: 2,
    marginBottom: 18,
    width: '100%',
  },
  inputLabel: {
    color: '#96908dff',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
    marginLeft: 2,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 6,
    width: '100%',
  },
  input: {
    backgroundColor: '#292524',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500',
    color: '#CFC9C7',
    marginBottom: 12,
    borderWidth: 0,
    width: '100%',
  },
  inputSmall: {
    flex: 1,
    marginBottom: 0,
    width: 'auto',
  },
  addButton: {
    backgroundColor: '#ff6600',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    marginTop: 2,
    marginBottom: 2,
    shadowColor: '#ff6600',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
    width: '100%',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  sectionHeader: {
    color: '#CFC9C7',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 15,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  courseList: {
    marginBottom: 8,
    paddingHorizontal: 18,
  },
  courseCardModern: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#292524',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 18,
    marginBottom: 14,
    borderWidth: 0,
  },
  courseTitleModern: {
    fontWeight: 'bold',
    fontSize: 16.5,
    color: '#CFC9C7',
    marginBottom: 2,
  },
  courseDetailsModern: {
    color: '#bfc6d1',
    fontSize: 13.5,
    marginBottom: 10,
  },
  gpaRightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6600',
    marginRight: 10,
    gap: 6,
    borderRadius: 15,
    paddingHorizontal: 5,
  },
  gpaLabelModern: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  gpaValueModern: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'right',
  },
  iconRowModern: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  iconButtonModern: {
    backgroundColor: 'transparent',
    padding: 4,
    marginLeft: 2,
    borderRadius: 6,
  },
  actionLogoModern: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: '#bfc6d1',
  },
  subjectIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#3a2a1e',
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
  subjectTitle: {
    fontWeight: 'bold',
    fontSize: 16.5,
    color: '#fff',
    marginBottom: 2,
  },
  subjectDetails: {
    color: '#bfc6d1',
    fontSize: 13.5,
    marginBottom: 10,
  },
  gpaBadgeBox: {
    backgroundColor: '#ff6600',
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 10,
    marginRight: 2,
    marginTop: -40,
  },
  gpaBadgeValue: {
    color: '#fff',
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
    backgroundColor: '#3a2a1e',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 13,
    marginRight: 8,
  },
  editButtonText: {
    color: '#bfc6d1',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: '#ff6600',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 13,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  calcButton: {
    backgroundColor: '#ff6600',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    marginHorizontal: 18,
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
  resultsCardModern: {
    backgroundColor: '#292524',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
    marginHorizontal: 18,
  },
  resultsLabelModern: {
    color: 'lightgray',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  resultsRowModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 32,
    marginBottom: 2,
    marginTop: 2,
  },
  resultsTextModern: {
    color: '#bfc6d1',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  resultsTextGpaModern: {
    color: '#ff6600',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.1,
  },
  resultsValueModern: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.1,
  },
  resultsGpaModern: {
    color: '#ff6600',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  dividerModern: {
    height: 1.5,
    backgroundColor: '#4F4F4F',
    marginVertical: 7,
    borderRadius: 2,
    opacity: 0.7,
  },
});
