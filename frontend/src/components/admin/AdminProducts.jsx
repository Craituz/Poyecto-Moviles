import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Button, Card } from "react-native-paper";

const mockProducts = [
  { id: 1, name: "Torta de zanahoria", description: "Esponjosa y dorada, cubierta con una mezcla abundante de frutos secos.", price: 18.00 },
  { id: 2, name: "Stalin", description: "Stalin José", price: 64.64 },
];

export default function AdminProducts() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
       <View style={styles.headerRow}>
           <View>
               <Text style={styles.sectionTitle}>Gestión de</Text>
               <Text style={styles.sectionTitleBold}>Productos</Text>
           </View>
           <Button mode="contained" icon="plus" buttonColor="#5D4037" onPress={() => {}}>
               Nuevo
           </Button>
       </View>

       {mockProducts.map((item) => (
           <Card key={item.id} style={styles.productCard}>
               <Card.Content>
                   <Text style={styles.prodName}>{item.name}</Text>
                   <Text style={styles.prodDesc}>{item.description}</Text>
                   <Text style={styles.prodPrice}>${item.price.toFixed(2).replace('.', ',')}</Text>
               </Card.Content>
               <Card.Actions style={styles.cardActions}>
                   <Button mode="outlined" textColor="#666" style={[styles.actionBtn, { borderColor: '#ddd' }]}>EDITAR</Button>
                   <View style={{ width: 10 }} />
                   <Button mode="contained" buttonColor="#D81B60" style={styles.actionBtn}>Eliminar</Button>
               </Card.Actions>
           </Card>
       ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, color: '#333' },
  sectionTitleBold: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  productCard: { backgroundColor: '#F3E5F5', marginBottom: 15, borderRadius: 15 },
  prodName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  prodDesc: { fontSize: 12, color: '#666', marginBottom: 10 },
  prodPrice: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: "#D81B60" },
  cardActions: { justifyContent: 'space-between' },
  actionBtn: { flex: 1, marginHorizontal: 5, borderRadius: 20 },
});