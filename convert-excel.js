import XLSX from 'xlsx';
import fs from 'fs';

// Leer el archivo Excel
const workbook = XLSX.readFile('listado_productos.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

console.log('📊 Hoja:', sheetName);

// Convertir a JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('\n📋 Total de filas:', data.length);

if (data.length > 0) {
  console.log('\n🔑 Columnas detectadas:');
  console.log(Object.keys(data[0]));
  console.log('\n📄 Primera fila de ejemplo:');
  console.log(data[0]);
}

// Mapear los datos al formato de la app
const productos = data
  .filter(row => {
    // Filtrar filas vacías
    return row['Nombre del Producto'] && row['Nombre del Producto'].toString().trim() !== '';
  })
  .map((row, index) => {
    return {
      id: index + 1,
      codigo: row['CODIGO'] || '',
      nombre: row['Nombre del Producto'] || '',
      categoria: row['Tipo de producto/Categoria'] || '',
      tamano: row['Tamaño'] || 'N/A',
      precio: parseFloat(row['PVP (€)'] || 0),
      coleccion: row['Nombre coleccion'] || '',
      stock: parseInt(row['Unidades en Stock'] || 0),
      createdAt: new Date().toISOString()
    };
  });

// Guardar como JSON
fs.writeFileSync('productos-inicial.json', JSON.stringify(productos, null, 2));

console.log(`\n✅ Convertidos ${productos.length} productos`);
console.log('📄 Archivo generado: productos-inicial.json');
console.log('\n🔍 Primeros 3 productos:');
productos.slice(0, 3).forEach(p => console.log(p));
