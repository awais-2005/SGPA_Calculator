import React from "react";
import { View, Text } from "react-native";

export default function ResultsCard({ totalPercentage, gpa, totalCredits, styles }) {
  return (
    <View style={styles.resultsCardModern}>
      <Text style={styles.resultsLabelModern}>Results</Text>
      <View style={styles.resultsRowModern}>
        <Text style={styles.resultsTextModern}>Total Percentage</Text>
        <Text style={styles.resultsValueModern}>{totalPercentage}%</Text>
      </View>
      <View style={styles.dividerModern} />
      <View style={styles.resultsRowModern}>
        <Text style={styles.resultsTextGpaModern}>Overall GPA</Text>
        <Text style={styles.resultsGpaModern}>{gpa}</Text>
      </View>
      <View style={styles.dividerModern} />
      <View style={styles.resultsRowModern}>
        <Text style={styles.resultsTextModern}>Total Credits</Text>
        <Text style={styles.resultsValueModern}>{totalCredits}</Text>
      </View>
    </View>
  );
}
