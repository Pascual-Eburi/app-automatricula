import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Componente para generar el PDF
const PDFGenerator = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Nombre: {data.nombre}</Text>
          <Text>Email: {data.email}</Text>
          <Text>Teléfono: {data.telefono}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFGenerator;

