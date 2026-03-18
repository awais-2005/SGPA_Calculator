import React from "react";
import { FlatList } from "react-native";
import CourseCard from "./CourseCard";

export default function CourseList({ courses, editId, onEdit, onDelete, calculateCardGPA, styles, hideActions }) {
  return (
    <FlatList
      data={editId ? courses.filter((c) => c.id !== editId) : courses}
      keyExtractor={(item) => item.id}
      style={styles.courseList}
      renderItem={({ item }) => (
        <CourseCard
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
          calculateCardGPA={calculateCardGPA}
          styles={styles}
          hideActions={hideActions}
        />
      )}
    />
  );
}
