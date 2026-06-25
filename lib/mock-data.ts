// Mock data importado del esquema relacional intelligent_food_completoG7.sql
// (Grupo 7 - ADS II). Los emojis, descripciones y tags son enriquecimientos UI.
// Todos los usuarios comparten la password demo "Tandil2026".

import {
  Comment,
  Cupon,
  Fridge,
  Group,
  Product,
  Purchase,
  SaldoMovimiento,
  StockLote,
  User,
} from "./types";

const DEMO_PASSWORD = "Tandil2026";

// =====================================================================
// USUARIOS (60)
// =====================================================================
type U = [
  number, string, string, string, "DNI" | "LE" | "LC" | "Pasaporte",
  "Femenino" | "Masculino" | "No binario" | "Prefiero no decir",
  string, string, string, string | null
];
const usuariosRaw: U[] = [
  [1,"Luca","Gonzalez","41455603","DNI","Masculino","luca.gonzalez1@outlook.com","+5492232868828","2025-08-26T04:47:00Z","MP-1A3D1FA7"],
  [2,"Amparo","Paez","44852685","Pasaporte","Masculino","amparo.paez2@yahoo.com.ar","+5492204265799","2025-02-09T02:13:00Z","MP-17FC695A"],
  [3,"Delfina","Gimenez","40200396","DNI","Femenino","delfina.gimenez3@yahoo.com.ar","+5492229587039","2026-04-14T18:17:00Z",null],
  [4,"Sofia","Ferreyra","20218062","LE","Femenino","sofia.ferreyra4@yahoo.com.ar","+5492245667651","2025-10-21T04:13:00Z",null],
  [5,"Delfina","Nuñez","31294238","DNI","Masculino","delfina.nunez5@yahoo.com.ar","+5492212981052","2026-01-12T11:38:00Z","MP-28DF6EC4"],
  [6,"Genaro","Romero","21457954","LC","Prefiero no decir","genaro.romero6@gmail.com","+5492250806024","2025-03-31T17:18:00Z",null],
  [7,"Maximiliano","Romero","40754078","LE","No binario","maximiliano.romero7@hotmail.com","+5492294566031","2025-03-22T01:42:00Z","MP-580D7B71"],
  [8,"Juan Martin","Cordoba","29710248","DNI","Femenino","juanmartin.cordoba8@gmail.com","+5492251019678","2025-10-21T14:40:00Z",null],
  [9,"Mateo Benjamin","Valdez","25457765","DNI","No binario","mateobenjamin.valdez9@hotmail.com","+5492289949389","2025-10-10T22:59:00Z","MP-A0EE89AE"],
  [10,"Ana Paula","Guzman","22395870","Pasaporte","Femenino","anapaula.guzman10@hotmail.com","+5492221931511","2026-04-28T12:17:00Z",null],
  [11,"Federico","Gonzalez","41474828","LC","Femenino","federico.gonzalez11@outlook.com","+5492207507864","2025-09-01T01:51:00Z","MP-DAF61A26"],
  [12,"Francisco","Gomez","28983893","DNI","Femenino","francisco.gomez12@outlook.com","+5492228538251","2026-06-05T12:56:00Z",null],
  [13,"Juan Manuel","Torres","35396513","DNI","No binario","juanmanuel.torres13@hotmail.com","+5492233101783","2025-10-06T23:37:00Z","MP-B3AA7EFE"],
  [14,"Santiago Nicolas","Moreno","39580115","DNI","No binario","santiagonicolas.moreno14@hotmail.com","+5492218566572","2026-05-30T02:48:00Z","MP-3EABEDCB"],
  [15,"Mateo","Alvarez","23679214","DNI","Femenino","mateo.alvarez15@yahoo.com.ar","+5492280048665","2025-03-16T12:24:00Z","MP-3838B326"],
  [16,"Ramiro","Mansilla","35705148","Pasaporte","No binario","ramiro.mansilla16@gmail.com","+5492291306093","2025-05-07T21:56:00Z","MP-CE177B4E"],
  [17,"Josefina","Perez","28953167","LE","No binario","josefina.perez17@gmail.com","+5492239392920","2026-03-31T05:29:00Z","MP-B7C93ACF"],
  [18,"Josefina","Ferreyra","44229388","LC","No binario","josefina.ferreyra18@hotmail.com","+5492268139880","2025-04-28T20:19:00Z",null],
  [19,"Uma","Medina","37034339","Pasaporte","Femenino","uma.medina19@hotmail.com","+5492250185867","2025-06-24T17:49:00Z",null],
  [20,"Emma","Castro","20019189","Pasaporte","No binario","emma.castro20@yahoo.com.ar","+5492202614124","2025-05-04T11:56:00Z",null],
  [21,"Maria Victoria","Mendoza","30318461","DNI","Masculino","mariavictoria.mendoza21@hotmail.com","+5492276149359","2025-03-31T02:46:00Z","MP-2369B584"],
  [22,"Bianca","Gomez","22322386","LE","Femenino","bianca.gomez22@hotmail.com","+5492288550256","2026-05-11T17:10:00Z","MP-28F49481"],
  [23,"Sol","Flores","40353914","DNI","Femenino","sol.flores23@hotmail.com","+5492295690391","2025-11-25T12:42:00Z","MP-77D21E02"],
  [24,"Julia","Valdez","34700199","Pasaporte","Prefiero no decir","julia.valdez24@gmail.com","+5492233273328","2025-08-28T02:21:00Z","MP-1D53434B"],
  [25,"Thiago Ezequiel","Rojas","38586522","DNI","Femenino","thiagoezequiel.rojas25@gmail.com","+5492209528530","2025-03-11T07:04:00Z",null],
  [26,"Santino Benjamin","Gomez","31087340","DNI","Femenino","santinobenjamin.gomez26@outlook.com","+5492289788677","2026-05-22T06:34:00Z","MP-B8DB0672"],
  [27,"Thiago Lionel","Perez","39161026","Pasaporte","Prefiero no decir","thiagolionel.perez27@hotmail.com","+5492263481353","2026-03-02T06:06:00Z","MP-1B3DBD5C"],
  [28,"Tiziana","Garcia","34463677","DNI","Prefiero no decir","tiziana.garcia28@yahoo.com.ar","+5492262682989","2025-03-06T21:41:00Z",null],
  [29,"Tomas","Fernandez","23302355","DNI","Prefiero no decir","tomas.fernandez29@outlook.com","+5492214665841","2025-09-21T06:12:00Z","MP-EC24A3C5"],
  [30,"Julia","Gonzalez","24703737","DNI","Femenino","julia.gonzalez30@outlook.com","+5492262092888","2025-09-22T02:28:00Z",null],
  [31,"Benjamin","Soria","38465853","DNI","Masculino","benjamin.soria31@gmail.com","+5492212517517","2025-09-09T05:26:00Z","MP-3D4CBF37"],
  [32,"Isabella","Lucero","27172169","LE","Prefiero no decir","isabella.lucero32@gmail.com","+5492222097220","2026-02-02T00:24:00Z","MP-D0E6E660"],
  [33,"Bautista","Coronel","46309043","LE","Prefiero no decir","bautista.coronel33@outlook.com","+5492256775103","2026-05-23T04:12:00Z","MP-F264ACCC"],
  [34,"Nicolas","Perez","21962373","Pasaporte","Masculino","nicolas.perez34@outlook.com","+5492207672593","2025-03-02T18:30:00Z","MP-EDCD465E"],
  [35,"Juan Pablo","Ojeda","37821635","DNI","Masculino","juanpablo.ojeda35@gmail.com","+5492224941004","2025-03-21T19:04:00Z","MP-ABF3AD39"],
  [36,"Lara","Benitez","27892133","DNI","Masculino","lara.benitez36@hotmail.com","+5492277701200","2025-02-19T19:05:00Z","MP-1064005C"],
  [37,"Alma","Nuñez","39584792","Pasaporte","No binario","alma.nunez37@outlook.com","+5492227415205","2025-11-27T07:16:00Z","MP-B535106E"],
  [38,"Agustín","Martinez","42538183","LC","No binario","agustin.martinez38@yahoo.com.ar","+5492242436584","2025-03-25T00:29:00Z","MP-839FBC50"],
  [39,"Emma","Carrizo","38890931","DNI","Masculino","emma.carrizo39@hotmail.com","+5492267898694","2025-10-08T04:59:00Z","MP-E1E3DB63"],
  [40,"Franco","Herrera","22308253","DNI","No binario","franco.herrera40@outlook.com","+5492221172421","2026-04-03T17:45:00Z","MP-1825BC54"],
  [41,"Catalina","Benitez","41943803","Pasaporte","Masculino","catalina.benitez41@outlook.com","+5492289038526","2025-04-26T04:16:00Z","MP-0DDE29A6"],
  [42,"Felicitas","Velazquez","23591531","LC","Femenino","felicitas.velazquez42@outlook.com","+5492237816686","2025-08-13T22:21:00Z","MP-CCF3A171"],
  [43,"Candela","Martinez","41281494","LE","No binario","candela.martinez43@yahoo.com.ar","+5492233704923","2025-03-03T02:40:00Z","MP-2EF91276"],
  [44,"Victoria","Martinez","29283847","DNI","Masculino","victoria.martinez44@outlook.com","+5492217558317","2025-10-05T05:47:00Z","MP-DB20A56E"],
  [45,"Nicolas","Rodriguez","43678270","DNI","Masculino","nicolas.rodriguez45@gmail.com","+5492210099059","2025-06-11T17:02:00Z",null],
  [46,"Miguel Angel","Martin","39545777","Pasaporte","Femenino","miguelangel.martin46@yahoo.com.ar","+5492217105448","2025-02-21T09:23:00Z",null],
  [47,"Juan Francisco","Lopez","46713431","LE","Masculino","juanfrancisco.lopez47@outlook.com","+5492228195995","2025-09-22T21:06:00Z","MP-E7067EF4"],
  [48,"Isabella","Alvarez","38786573","LE","Prefiero no decir","isabella.alvarez48@hotmail.com","+5492231774346","2025-06-25T05:56:00Z","MP-C8FE3CCD"],
  [49,"Facundo","Flores","26018345","LC","No binario","facundo.flores49@yahoo.com.ar","+5492289913412","2025-09-21T08:10:00Z",null],
  [50,"Jeronimo","Castro","23627087","DNI","Masculino","jeronimo.castro50@yahoo.com.ar","+5492229854548","2025-08-02T14:22:00Z","MP-37BB3EEC"],
  [51,"León","Silva","46687366","LE","Femenino","leon.silva51@hotmail.com","+5492203176186","2025-07-26T12:21:00Z","MP-0CD620C2"],
  [52,"Maria Victoria","Gimenez","22329373","LE","No binario","mariavictoria.gimenez52@outlook.com","+5492286098221","2026-02-23T21:53:00Z","MP-82010C62"],
  [53,"Bautista","Lopez","20926120","DNI","No binario","bautista.lopez53@hotmail.com","+5492277925434","2025-10-08T01:06:00Z","MP-675DD5AF"],
  [54,"Juan Ignacio","Paez","31599334","LC","No binario","juanignacio.paez54@yahoo.com.ar","+5492281363974","2025-05-08T12:57:00Z","MP-14FCDD54"],
  [55,"Ciro","Nuñez","28547069","DNI","Prefiero no decir","ciro.nunez55@gmail.com","+5492269782527","2025-07-30T11:27:00Z","MP-AB73295B"],
  [56,"Thiago Agustin","Martinez","42288118","DNI","No binario","thiagoagustin.martinez56@gmail.com","+5492296603781","2025-11-13T16:19:00Z","MP-750CAB75"],
  [57,"Josefina","Cardozo","30944882","DNI","No binario","josefina.cardozo57@hotmail.com","+5492225748341","2026-03-16T21:24:00Z","MP-902059E4"],
  [58,"Máximo","Rodriguez","25839388","Pasaporte","No binario","maximo.rodriguez58@yahoo.com.ar","+5492273542887","2025-01-10T09:18:00Z","MP-5958A499"],
  [59,"Justina","Lucero","46365691","Pasaporte","No binario","justina.lucero59@yahoo.com.ar","+5492259295515","2026-04-07T21:13:00Z","MP-8B10550C"],
  [60,"Federico","Cabrera","46633340","LE","Femenino","federico.cabrera60@gmail.com","+5492238089166","2025-12-19T02:52:00Z",null],
];

export const seedUsers: User[] = usuariosRaw.map(
  ([id,nombre,apellido,dni,tipoDoc,sexo,mail,celular,fechaAlta,mp]) => ({
    id: `u_${id}`,
    nombre,
    apellido,
    dni,
    tipoDoc,
    sexo,
    mail,
    celular,
    password: DEMO_PASSWORD,
    fechaAlta,
    cuentaMercadoPago: mp,
  })
);

// =====================================================================
// HELADERAS (15)
// =====================================================================
// Coordenadas ilustrativas alrededor de Tandil (-37.3217, -59.1332).
type F = [
  number,
  string,
  "Habilitada" | "Mantenimiento" | "Deshabilitada",
  number,
  string,
];
const heladerasRaw: F[] = [
  [1, "Av. Avellaneda 451, Tandil - Café Central", "Habilitada", 0.3, "37.3198° S, 59.1340° W"],
  [2, "Av. Santamarina 763, Tandil - Universidad UNICEN, Ed. Rectorado", "Habilitada", 0.9, "37.3245° S, 59.1361° W"],
  [3, "España 720, Tandil - Terminal de Ómnibus", "Habilitada", 1.4, "37.3289° S, 59.1294° W"],
  [4, "9 de Julio 845, Tandil - Edificio Facultad de Ciencias Exactas", "Habilitada", 1.1, "37.3220° S, 59.1318° W"],
  [5, "Pinto 2338, Tandil - Hospital Ramón Santamarina", "Habilitada", 2.3, "37.3104° S, 59.1247° W"],
  [6, "Av. Las Heras 3850, Tandil - Shopping Tandil Center", "Habilitada", 2.8, "37.3057° S, 59.1539° W"],
  [7, "Rivadavia 565, Tandil - Plaza Independencia", "Habilitada", 0.5, "37.3217° S, 59.1332° W"],
  [8, "Maipú 902, Tandil - Estación de servicio YPF", "Habilitada", 1.8, "37.3271° S, 59.1280° W"],
  [9, "Belgrano 1452, Tandil - Polideportivo Municipal", "Habilitada", 2.1, "37.3158° S, 59.1212° W"],
  [10, "Av. Don Bosco 2150, Tandil - Acceso Sierra del Tigre", "Habilitada", 3.7, "37.2812° S, 59.1567° W"],
  [11, "Colón 412, Tandil - Edificio Municipal", "Habilitada", 0.7, "37.3231° S, 59.1349° W"],
  [12, "Av. Espora 1780, Tandil - Complejo Movediza", "Mantenimiento", 4.2, "37.2989° S, 59.1481° W"],
  [13, "San Martín 988, Tandil - Galería comercial centro", "Mantenimiento", 0.6, "37.3210° S, 59.1325° W"],
  [14, "25 de Mayo 612, Tandil - Estación de tren", "Mantenimiento", 1.0, "37.3327° S, 59.1318° W"],
  [15, "Gral. Paz 1390, Tandil - Facultad de Veterinaria UNICEN", "Deshabilitada", 2.5, "37.3344° S, 59.1422° W"],
];

const nombreCorto = (ubicacion: string) =>
  ubicacion.split(" - ")[1] ?? ubicacion.split(",")[0];

export const seedFridges: Fridge[] = heladerasRaw.map(
  ([id, ubicacion, estado, distanceKm, coordinates]) => ({
    id: `f_${id}`,
    nombre: nombreCorto(ubicacion),
    ubicacion,
    estado,
    distanceKm,
    coordinates,
  })
);

// =====================================================================
// PRODUCTOS (32)
// =====================================================================
type P = [number, string, string, number];
const productosRaw: P[] = [
  [1, "Vianda Pollo al horno con puré", "Plato principal", 4200],
  [2, "Vianda Milanesa de carne con ensalada", "Plato principal", 4500],
  [3, "Vianda Tarta de verdura", "Plato principal", 3800],
  [4, "Vianda Vegetariana de garbanzos", "Plato principal", 3900],
  [5, "Vianda Pastel de papa", "Plato principal", 4100],
  [6, "Vianda Wok de fideos con vegetales", "Plato principal", 4000],
  [7, "Vianda Guiso de lentejas", "Plato principal", 3700],
  [8, "Vianda Pollo al curry con arroz", "Plato principal", 4300],
  [9, "Ensalada César con pollo", "Ensalada", 3500],
  [10, "Ensalada de quinoa y vegetales", "Ensalada", 3400],
  [11, "Sandwich de jamón crudo y rúcula", "Sandwich", 2800],
  [12, "Sandwich vegetariano integral", "Sandwich", 2700],
  [13, "Wrap de pollo y vegetales", "Sandwich", 3000],
  [14, "Yogur con granola y frutos rojos", "Snack saludable", 2200],
  [15, "Ensalada de frutas de estación", "Snack saludable", 2100],
  [16, "Barrita de cereal artesanal", "Snack saludable", 1200],
  [17, "Bowl de frutos secos", "Snack saludable", 1800],
  [18, "Agua mineral sin gas 500ml", "Bebida", 900],
  [19, "Agua saborizada pomelo 500ml", "Bebida", 1100],
  [20, "Jugo de naranja exprimido 300ml", "Bebida", 1500],
  [21, "Limonada artesanal 500ml", "Bebida", 1400],
  [22, "Café latte para llevar", "Bebida", 1600],
  [23, "Gaseosa cola 500ml", "Bebida", 1300],
  [24, "Alfajor de maicena artesanal", "Postre", 1100],
  [25, "Brownie con nuez", "Postre", 1300],
  [26, "Flan casero con dulce de leche", "Postre", 1500],
  [27, "Cheesecake individual de frutos rojos", "Postre", 1900],
  [28, "Budín de limón", "Postre", 1400],
  [29, "Empanada de carne (unidad)", "Snack salado", 900],
  [30, "Empanada de jamón y queso (unidad)", "Snack salado", 850],
  [31, "Medialunas x3", "Panificado", 1300],
  [32, "Pan de campo individual", "Panificado", 1000],
];

const productoMeta: Record<string, { emoji: string; desc: string; tags: string[] }> = {
  "Plato principal": {
    emoji: "🍱",
    desc: "Vianda balanceada elaborada en cocina central, lista para retirar y consumir.",
    tags: ["vianda", "balanceado"],
  },
  Ensalada: {
    emoji: "🥗",
    desc: "Ensalada fresca con mix de hojas, proteínas y aderezo del día.",
    tags: ["veggie", "fresco"],
  },
  Sandwich: {
    emoji: "🥪",
    desc: "Sandwich preparado en el día con pan recién horneado.",
    tags: ["rápido", "fresco"],
  },
  "Snack saludable": {
    emoji: "🍓",
    desc: "Snack liviano y balanceado para cualquier momento del día.",
    tags: ["saludable", "veggie"],
  },
  Bebida: {
    emoji: "🥤",
    desc: "Bebida individual mantenida en frío.",
    tags: ["bebida"],
  },
  Postre: {
    emoji: "🍰",
    desc: "Postre casero del día.",
    tags: ["dulce"],
  },
  "Snack salado": {
    emoji: "🥟",
    desc: "Snack salado para el camino.",
    tags: ["rápido"],
  },
  Panificado: {
    emoji: "🥐",
    desc: "Panificado fresco horneado en cocina central.",
    tags: ["desayuno"],
  },
};

const emojiOverrides: Record<number, string> = {
  1: "🍗", 2: "🥩", 3: "🥧", 4: "🥘", 5: "🥔", 6: "🍜", 7: "🍲", 8: "🍛",
  14: "🫐", 15: "🍇", 16: "🍫", 17: "🥜", 18: "💧", 19: "🍹", 20: "🍊",
  21: "🍋", 22: "☕", 23: "🥤", 24: "🥮", 25: "🍫", 26: "🍮", 27: "🍰",
  28: "🍋", 29: "🥟", 30: "🥟", 31: "🥐", 32: "🍞",
};

// Fotos locales en /public/products/p_<id>.png — todos los 32 productos del
// catálogo del Grupo 7 tienen foto provista.

export const seedProducts: Product[] = productosRaw.map(([id, nombre, tipo, precio]) => {
  const meta = productoMeta[tipo] ?? { emoji: "🍽️", desc: nombre, tags: [tipo.toLowerCase()] };
  return {
    id: `p_${id}`,
    nombre,
    tipo,
    precio,
    imageEmoji: emojiOverrides[id] ?? meta.emoji,
    imageUrl: `/products/p_${id}.png`,
    description: meta.desc,
    tags: meta.tags,
  };
});

// =====================================================================
// STOCK (172 lotes por heladera/producto/lote)
// =====================================================================
type S = [number, number, number, string, number, number, string];
const stockRaw: S[] = [
  [1,1,20,"L0120725",2,8,"2026-07-04"],[2,1,8,"L0108744",18,6,"2026-07-13"],[3,1,26,"L0126813",12,8,"2026-07-03"],
  [4,1,7,"L0107349",4,10,"2026-07-13"],[5,1,5,"L0105105",3,8,"2026-06-28"],[6,1,1,"L0101280",16,8,"2026-06-22"],
  [7,1,2,"L0102670",7,5,"2026-07-05"],[8,1,31,"L0131236",14,10,"2026-07-07"],[9,1,16,"L0116672",19,7,"2026-07-15"],
  [10,2,28,"L0228960",20,7,"2026-07-15"],[11,2,27,"L0227896",16,8,"2026-07-11"],[12,2,30,"L0230344",8,8,"2026-06-23"],
  [13,2,18,"L0218830",9,6,"2026-06-29"],[14,2,15,"L0215443",10,9,"2026-06-23"],[15,2,6,"L0206241",4,6,"2026-07-03"],
  [16,2,24,"L0224810",4,10,"2026-06-27"],[17,2,16,"L0216165",13,8,"2026-07-01"],[18,2,32,"L0232655",14,8,"2026-06-22"],
  [19,2,9,"L0209311",13,8,"2026-07-19"],[20,2,8,"L0208888",18,10,"2026-06-21"],[21,3,25,"L0325379",13,8,"2026-06-21"],
  [22,3,16,"L0316498",10,10,"2026-07-12"],[23,3,1,"L0301917",12,10,"2026-06-26"],[24,3,12,"L0312960",14,6,"2026-07-10"],
  [25,3,10,"L0310646",0,8,"2026-07-09"],[26,3,32,"L0332677",0,5,"2026-07-11"],[27,3,13,"L0313538",4,8,"2026-06-26"],
  [28,3,14,"L0314151",8,8,"2026-07-01"],[29,3,18,"L0318316",14,7,"2026-07-01"],[30,3,24,"L0324879",12,7,"2026-07-15"],
  [31,3,20,"L0320951",13,7,"2026-07-17"],[32,3,8,"L0308183",15,5,"2026-07-14"],[33,3,31,"L0331652",1,7,"2026-06-28"],
  [34,3,21,"L0321765",2,10,"2026-06-22"],[35,4,2,"L0402576",8,7,"2026-06-26"],[36,4,31,"L0431720",19,10,"2026-07-13"],
  [37,4,8,"L0408217",5,7,"2026-06-24"],[38,4,7,"L0407692",0,7,"2026-07-09"],[39,4,27,"L0427793",12,8,"2026-07-13"],
  [40,4,1,"L0401303",2,9,"2026-07-13"],[41,4,20,"L0420950",20,6,"2026-06-24"],[42,4,5,"L0405813",9,10,"2026-07-10"],
  [43,4,30,"L0430924",3,9,"2026-07-16"],[44,4,25,"L0425142",11,9,"2026-07-04"],[45,4,16,"L0416777",11,5,"2026-07-07"],
  [46,4,4,"L0404763",10,5,"2026-07-18"],[47,4,19,"L0419530",15,5,"2026-07-04"],[48,4,29,"L0429470",20,8,"2026-07-13"],
  [49,5,28,"L0528576",13,10,"2026-07-09"],[50,5,6,"L0506374",10,6,"2026-07-17"],[51,5,24,"L0524188",8,8,"2026-06-28"],
  [52,5,17,"L0517868",14,9,"2026-07-10"],[53,5,21,"L0521784",12,7,"2026-06-21"],[54,5,9,"L0509606",10,6,"2026-07-06"],
  [55,5,20,"L0520317",11,7,"2026-07-01"],[56,5,18,"L0518386",19,10,"2026-07-19"],[57,5,16,"L0516382",17,5,"2026-07-07"],
  [58,6,6,"L0606587",20,10,"2026-07-06"],[59,6,8,"L0608558",0,5,"2026-06-30"],[60,6,24,"L0624326",12,10,"2026-06-28"],
  [61,6,14,"L0614413",18,7,"2026-07-06"],[62,6,16,"L0616666",16,7,"2026-07-04"],[63,6,18,"L0618863",17,7,"2026-07-02"],
  [64,6,25,"L0625819",14,7,"2026-06-30"],[65,6,31,"L0631357",7,5,"2026-07-14"],[66,6,23,"L0623297",10,5,"2026-07-14"],
  [67,7,12,"L0712952",6,7,"2026-06-28"],[68,7,7,"L0707469",5,7,"2026-06-21"],[69,7,31,"L0731825",17,6,"2026-06-29"],
  [70,7,24,"L0724146",1,9,"2026-06-30"],[71,7,16,"L0716814",4,10,"2026-07-18"],[72,7,9,"L0709870",15,5,"2026-07-18"],
  [73,7,29,"L0729112",18,7,"2026-07-06"],[74,7,19,"L0719590",14,7,"2026-06-26"],[75,7,17,"L0717152",8,8,"2026-06-24"],
  [76,7,20,"L0720941",2,8,"2026-07-06"],[77,7,10,"L0710175",18,10,"2026-07-12"],[78,7,4,"L0704154",4,6,"2026-07-16"],
  [79,8,20,"L0820489",14,8,"2026-06-30"],[80,8,3,"L0803980",18,8,"2026-06-30"],[81,8,8,"L0808682",19,5,"2026-07-10"],
  [82,8,4,"L0804857",3,6,"2026-07-11"],[83,8,18,"L0818316",8,10,"2026-06-23"],[84,8,25,"L0825260",7,6,"2026-07-08"],
  [85,8,14,"L0814176",5,5,"2026-07-04"],[86,8,32,"L0832561",19,8,"2026-06-30"],[87,8,27,"L0827133",7,7,"2026-07-13"],
  [88,8,24,"L0824389",14,5,"2026-07-12"],[89,8,30,"L0830339",8,10,"2026-07-09"],[90,8,17,"L0817777",6,8,"2026-06-24"],
  [91,9,15,"L0915395",14,5,"2026-07-05"],[92,9,21,"L0921805",9,10,"2026-07-03"],[93,9,5,"L0905378",16,9,"2026-07-06"],
  [94,9,9,"L0909548",2,9,"2026-06-22"],[95,9,27,"L0927542",10,9,"2026-06-29"],[96,9,30,"L0930126",2,6,"2026-07-12"],
  [97,9,3,"L0903956",18,9,"2026-06-21"],[98,9,2,"L0902883",8,9,"2026-06-22"],[99,9,6,"L0906881",5,8,"2026-07-07"],
  [100,9,10,"L0910767",14,7,"2026-06-26"],[101,9,20,"L0920699",13,10,"2026-07-17"],[102,9,19,"L0919603",2,8,"2026-07-02"],
  [103,10,22,"L1022778",12,9,"2026-06-22"],[104,10,11,"L1011565",2,7,"2026-06-29"],[105,10,32,"L1032431",3,8,"2026-07-18"],
  [106,10,4,"L1004626",0,10,"2026-07-18"],[107,10,28,"L1028655",14,8,"2026-06-22"],[108,10,6,"L1006292",16,7,"2026-07-10"],
  [109,10,31,"L1031874",15,10,"2026-07-05"],[110,10,14,"L1014878",1,6,"2026-06-29"],[111,10,23,"L1023662",4,7,"2026-07-05"],
  [112,10,16,"L1016815",15,5,"2026-06-21"],[113,10,10,"L1010745",19,6,"2026-07-13"],[114,11,20,"L1120220",20,6,"2026-07-06"],
  [115,11,18,"L1118833",9,9,"2026-07-13"],[116,11,1,"L1101379",13,8,"2026-07-06"],[117,11,31,"L1131349",14,9,"2026-06-25"],
  [118,11,14,"L1114492",6,9,"2026-07-07"],[119,11,3,"L1103864",4,5,"2026-06-29"],[120,11,8,"L1108891",13,7,"2026-07-20"],
  [121,11,4,"L1104906",16,7,"2026-07-17"],[122,11,15,"L1115102",9,10,"2026-06-30"],[123,12,32,"L1232814",7,9,"2026-07-03"],
  [124,12,28,"L1228339",13,5,"2026-07-01"],[125,12,5,"L1205862",15,10,"2026-07-20"],[126,12,15,"L1215930",12,8,"2026-07-12"],
  [127,12,18,"L1218911",20,6,"2026-07-06"],[128,12,16,"L1216137",4,9,"2026-07-09"],[129,12,12,"L1212439",3,8,"2026-06-24"],
  [130,12,11,"L1211638",14,5,"2026-07-14"],[131,12,31,"L1231247",13,10,"2026-06-25"],[132,12,24,"L1224176",15,7,"2026-07-01"],
  [133,12,13,"L1213738",12,10,"2026-06-23"],[134,12,29,"L1229972",10,10,"2026-07-18"],[135,12,25,"L1225646",12,7,"2026-07-11"],
  [136,12,7,"L1207835",15,9,"2026-06-22"],[137,13,5,"L1305554",5,10,"2026-06-30"],[138,13,8,"L1308129",1,7,"2026-07-16"],
  [139,13,21,"L1321157",9,7,"2026-07-02"],[140,13,22,"L1322541",4,6,"2026-07-07"],[141,13,10,"L1310521",18,10,"2026-07-16"],
  [142,13,31,"L1331284",5,6,"2026-06-23"],[143,13,24,"L1324724",12,9,"2026-07-12"],[144,13,3,"L1303346",15,9,"2026-06-25"],
  [145,13,14,"L1314337",14,10,"2026-06-29"],[146,13,4,"L1304570",8,10,"2026-06-21"],[147,13,30,"L1330923",14,7,"2026-07-12"],
  [148,13,23,"L1323659",5,5,"2026-07-05"],[149,14,20,"L1420209",7,8,"2026-07-09"],[150,14,21,"L1421467",18,7,"2026-07-13"],
  [151,14,14,"L1414402",0,10,"2026-07-03"],[152,14,23,"L1423381",0,9,"2026-07-18"],[153,14,9,"L1409802",1,9,"2026-07-14"],
  [154,14,15,"L1415608",9,6,"2026-07-10"],[155,14,10,"L1410921",11,6,"2026-07-11"],[156,14,7,"L1407294",19,7,"2026-07-12"],
  [157,14,13,"L1413873",4,10,"2026-06-24"],[158,14,16,"L1416742",20,5,"2026-06-30"],[159,15,29,"L1529997",11,9,"2026-07-07"],
  [160,15,2,"L1502379",5,7,"2026-07-20"],[161,15,19,"L1519944",15,7,"2026-07-14"],[162,15,12,"L1512991",10,5,"2026-07-05"],
  [163,15,24,"L1524177",4,6,"2026-07-18"],[164,15,5,"L1505792",12,9,"2026-07-02"],[165,15,3,"L1503192",12,5,"2026-06-29"],
  [166,15,10,"L1510649",3,8,"2026-07-02"],[167,15,11,"L1511788",8,9,"2026-07-03"],[168,15,14,"L1514942",20,7,"2026-06-24"],
  [169,15,6,"L1506791",7,8,"2026-06-21"],[170,15,7,"L1507734",17,7,"2026-07-20"],[171,15,27,"L1527724",7,10,"2026-06-23"],
  [172,15,18,"L1518750",14,10,"2026-06-30"],
];

export const seedStock: StockLote[] = stockRaw.map(([id, fid, pid, lote, cantidad, limite, venc]) => ({
  id: `st_${id}`,
  fridgeId: `f_${fid}`,
  productId: `p_${pid}`,
  lote,
  cantidad,
  cantidadLimite: limite,
  fechaVencimiento: venc,
}));

// =====================================================================
// CUPONES (45 — uno por usuario)
// =====================================================================
type C = [number, number, string, number, string, "Disponible" | "Usado" | "Vencido"];
const cuponesRaw: C[] = [
  [1,14,"CUP-RP99JB",15,"2026-08-06","Disponible"],
  [2,21,"CUP-BL94RS",30,"2026-06-30","Usado"],
  [3,26,"CUP-WA45LJ",10,"2026-08-26","Usado"],
  [4,33,"CUP-EJ96VO",25,"2026-06-03","Usado"],
  [5,16,"CUP-VH01NY",20,"2026-06-05","Usado"],
  [6,29,"CUP-VK67XT",10,"2026-06-08","Disponible"],
  [7,4,"CUP-MF59DJ",15,"2026-07-09","Vencido"],
  [8,16,"CUP-DR29FR",10,"2026-09-02","Usado"],
  [9,60,"CUP-FM76CA",25,"2026-08-21","Usado"],
  [10,13,"CUP-WG43HW",10,"2026-07-23","Vencido"],
  [11,32,"CUP-SR61RL",15,"2026-07-23","Disponible"],
  [12,6,"CUP-QT78CO",20,"2026-07-24","Vencido"],
  [13,16,"CUP-DA69NT",10,"2026-08-03","Usado"],
  [14,4,"CUP-WQ32SU",5,"2026-06-26","Vencido"],
  [15,39,"CUP-FV10BL",30,"2026-08-15","Vencido"],
  [16,19,"CUP-IT26OG",25,"2026-05-22","Disponible"],
  [17,28,"CUP-EZ85VC",10,"2026-09-10","Usado"],
  [18,47,"CUP-DE60UK",15,"2026-08-26","Vencido"],
  [19,24,"CUP-ZT69OA",5,"2026-07-11","Disponible"],
  [20,37,"CUP-ZB41UK",25,"2026-06-14","Usado"],
  [21,36,"CUP-SX97FB",15,"2026-05-30","Vencido"],
  [22,33,"CUP-BL13ZH",20,"2026-08-26","Usado"],
  [23,53,"CUP-TV16VO",25,"2026-08-16","Disponible"],
  [24,9,"CUP-EG52OH",5,"2026-07-10","Usado"],
  [25,51,"CUP-MX88WW",15,"2026-07-31","Usado"],
  [26,49,"CUP-GJ23QM",10,"2026-06-15","Vencido"],
  [27,33,"CUP-JW29WP",15,"2026-08-26","Disponible"],
  [28,9,"CUP-XO12FD",30,"2026-07-02","Vencido"],
  [29,34,"CUP-CR99KP",20,"2026-06-09","Disponible"],
  [30,21,"CUP-OU95JC",25,"2026-06-30","Disponible"],
  [31,26,"CUP-CO17TY",25,"2026-08-23","Usado"],
  [32,38,"CUP-DW49GE",15,"2026-07-24","Vencido"],
  [33,46,"CUP-CC47DX",25,"2026-06-28","Vencido"],
  [34,53,"CUP-PF41NM",5,"2026-07-07","Usado"],
  [35,44,"CUP-DL86JY",5,"2026-07-13","Usado"],
  [36,51,"CUP-ZK07PM",30,"2026-09-09","Disponible"],
  [37,39,"CUP-EG59JD",20,"2026-06-23","Disponible"],
  [38,47,"CUP-ZV71TF",5,"2026-08-03","Vencido"],
  [39,11,"CUP-CP82TC",25,"2026-08-09","Vencido"],
  [40,10,"CUP-HN78KX",30,"2026-06-21","Disponible"],
  [41,37,"CUP-YA54XV",30,"2026-06-04","Disponible"],
  [42,2,"CUP-YO90PV",20,"2026-06-30","Vencido"],
  [43,10,"CUP-GJ15RY",20,"2026-08-17","Disponible"],
  [44,27,"CUP-UQ44MJ",25,"2026-08-28","Vencido"],
  [45,56,"CUP-LQ51JW",30,"2026-08-22","Disponible"],
];

export const seedCupones: Cupon[] = cuponesRaw.map(
  ([id, uid, codigo, pct, venc, estado]) => ({
    id: `cup_${id}`,
    userId: `u_${uid}`,
    codigo,
    porcentajeDto: pct,
    fechaVencimiento: venc,
    estado,
  })
);

// =====================================================================
// GRUPOS (12)
// =====================================================================
type G = { id: number; nombre: string; titular: number; miembros: number[] };
const gruposRaw: G[] = [
  { id: 1, nombre: "Familia Coronel", titular: 33, miembros: [33, 15, 20, 60, 8] },
  { id: 2, nombre: "Compañía Mendoza", titular: 21, miembros: [21, 49, 4, 32] },
  { id: 3, nombre: "Casa Velazquez", titular: 42, miembros: [42, 6] },
  { id: 4, nombre: "Departamento Fernandez", titular: 29, miembros: [29, 1, 50] },
  { id: 5, nombre: "Hogar Moreno", titular: 14, miembros: [14, 37] },
  { id: 6, nombre: "Casa Perez Lionel", titular: 27, miembros: [27, 25, 28, 36] },
  { id: 7, nombre: "Familia Gimenez", titular: 52, miembros: [52, 18, 13, 59, 10] },
  { id: 8, nombre: "Casa Gonzalez F.", titular: 11, miembros: [11, 34] },
  { id: 9, nombre: "Pensión Nuñez", titular: 55, miembros: [55, 26, 57, 58] },
  { id: 10, nombre: "Casa Martinez V.", titular: 44, miembros: [44, 19] },
  { id: 11, nombre: "Hogar Carrizo", titular: 39, miembros: [39, 54, 45, 40, 31] },
  { id: 12, nombre: "Sin titular", titular: 12, miembros: [12, 30, 46] },
];

export const seedGroups: Group[] = gruposRaw.map((g) => ({
  id: `g_${g.id}`,
  nombre: g.nombre,
  ownerId: `u_${g.titular}`,
  memberIds: g.miembros.map((m) => `u_${m}`),
  pendingRequests:
    g.id === 1 ? [{ userId: "u_4", userName: "Sofia Ferreyra" }] : [],
}));

// =====================================================================
// SALDOS — movimientos por grupo (extracto del SQL)
// =====================================================================
type Sal = [number, number, number, string, "CARGA" | "USO"];
const saldosRaw: Sal[] = [
  [1,1,12077.97,"2026-05-18T00:00:00Z","USO"],
  [2,1,19905.85,"2025-12-14T00:00:00Z","CARGA"],
  [3,1,23837.74,"2026-06-03T00:00:00Z","CARGA"],
  [4,1,17618.43,"2025-10-20T00:00:00Z","USO"],
  [5,1,12210.60,"2026-05-11T00:00:00Z","CARGA"],
  [6,1,14177.58,"2026-03-10T00:00:00Z","USO"],
  [7,2,7741.07,"2026-05-21T00:00:00Z","USO"],
  [8,2,6279.11,"2025-09-27T00:00:00Z","CARGA"],
  [9,2,14918.47,"2026-02-05T00:00:00Z","CARGA"],
  [10,2,18192.87,"2026-04-26T00:00:00Z","USO"],
  [11,3,23079.01,"2025-10-11T00:00:00Z","CARGA"],
  [12,3,5121.75,"2026-05-13T00:00:00Z","CARGA"],
  [13,3,22669.62,"2025-11-04T00:00:00Z","CARGA"],
  [14,3,20641.80,"2025-10-15T00:00:00Z","USO"],
  [15,3,9350.52,"2026-03-23T00:00:00Z","USO"],
  [16,3,14649.93,"2026-04-06T00:00:00Z","USO"],
  [21,5,15162.38,"2025-10-23T00:00:00Z","CARGA"],
  [22,5,14687.88,"2026-01-14T00:00:00Z","USO"],
  [23,6,11157.68,"2025-10-17T00:00:00Z","CARGA"],
  [24,6,19690.78,"2025-08-29T00:00:00Z","CARGA"],
  [25,7,9291.64,"2026-05-13T00:00:00Z","CARGA"],
  [26,7,17642.51,"2025-12-25T00:00:00Z","CARGA"],
  [27,8,19946.05,"2026-01-07T00:00:00Z","USO"],
  [29,8,22946.38,"2026-05-22T00:00:00Z","CARGA"],
  [30,9,8994.86,"2026-03-29T00:00:00Z","CARGA"],
  [31,9,18314.64,"2025-12-24T00:00:00Z","CARGA"],
  [38,11,23816.58,"2025-08-28T00:00:00Z","CARGA"],
  [39,11,6848.59,"2025-08-31T00:00:00Z","CARGA"],
];
export const seedSaldos: SaldoMovimiento[] = saldosRaw.map(([id, gid, monto, fecha, tipo]) => ({
  id: `sal_${id}`,
  groupId: `g_${gid}`,
  monto,
  fecha,
  tipo,
}));

// =====================================================================
// COMPRAS + DETALLES (subset realista del SQL para historial/QR demo)
// =====================================================================
function buildPurchase(args: {
  id: number;
  comprador: number;
  consumidor: number;
  heladera: number;
  cuponId?: number;
  total: number;
  fecha: string;
  token: string;
  estado: "Pendiente" | "Retirada" | "Vencida-Reembolsada";
  items: { productoId: number; cantidad: number }[];
}): Purchase {
  const subtotal = args.items.reduce((s, it) => {
    const p = productosRaw.find((x) => x[0] === it.productoId)!;
    return s + p[3] * it.cantidad;
  }, 0);
  const discount = subtotal - args.total >= 0 ? subtotal - args.total : 0;
  const fechaIso = args.fecha.includes("T") ? args.fecha : `${args.fecha}Z`;
  const expires = new Date(new Date(fechaIso).getTime() + 4 * 60 * 60 * 1000).toISOString();
  return {
    id: `pur_${args.id}`,
    compradorId: `u_${args.comprador}`,
    consumidorId: `u_${args.consumidor}`,
    fridgeId: `f_${args.heladera}`,
    cuponId: args.cuponId ? `cup_${args.cuponId}` : undefined,
    items: args.items.map((it) => {
      const p = productosRaw.find((x) => x[0] === it.productoId)!;
      return {
        productId: `p_${it.productoId}`,
        productName: p[1],
        quantity: it.cantidad,
        unitPrice: p[3],
      };
    }),
    subtotal,
    discount,
    total: args.total,
    paymentMethod: "mercado_pago",
    createdAt: fechaIso,
    expiresAt: expires,
    status: args.estado,
    tokenApertura: args.token,
  };
}

const now = "2026-06-20T11:00:00Z";

export const seedPurchases: Purchase[] = [
  // Demo user (id 33 = Bautista Coronel) compras
  buildPurchase({
    id: 17, comprador: 33, consumidor: 33, heladera: 7, total: 13000,
    fecha: "2025-07-23T11:30:00", token: "TOK-41036971", estado: "Retirada",
    items: [{ productoId: 9, cantidad: 1 }, { productoId: 16, cantidad: 1 }, { productoId: 12, cantidad: 3 }],
  }),
  buildPurchase({
    id: 135, comprador: 33, consumidor: 52, heladera: 3, total: 29200,
    fecha: "2026-02-19T09:19:00", token: "TOK-21765918", estado: "Retirada",
    items: [{ productoId: 8, cantidad: 4 }, { productoId: 31, cantidad: 6 }, { productoId: 24, cantidad: 4 }],
  }),
  // Compra activa demo (pendiente, dentro de las 4 horas)
  {
    id: "pur_demo_active",
    compradorId: "u_33",
    consumidorId: "u_33",
    fridgeId: "f_1",
    cuponId: "cup_27",
    items: [
      { productId: "p_8", productName: "Vianda Pollo al curry con arroz", quantity: 1, unitPrice: 4300 },
      { productId: "p_24", productName: "Alfajor de maicena artesanal", quantity: 2, unitPrice: 1100 },
    ],
    subtotal: 6500,
    discount: 975,
    total: 5525,
    paymentMethod: "mercado_pago",
    createdAt: new Date(new Date(now).getTime() - 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(new Date(now).getTime() + 3 * 60 * 60 * 1000).toISOString(),
    status: "Pendiente",
    tokenApertura: "TOK-DEMO-AB12",
  },
  // Resto del historial (selección representativa)
  buildPurchase({ id: 1, comprador: 46, consumidor: 46, heladera: 4, total: 13000, fecha: "2026-05-19T19:20:00", token: "TOK-46291486", estado: "Retirada", items: [{ productoId: 7, cantidad: 2 }, { productoId: 14, cantidad: 2 }, { productoId: 16, cantidad: 1 }] }),
  buildPurchase({ id: 2, comprador: 30, consumidor: 22, heladera: 9, total: 4900, fecha: "2025-10-12T22:12:00", token: "TOK-52816850", estado: "Retirada", items: [{ productoId: 18, cantidad: 1 }, { productoId: 9, cantidad: 1 }] }),
  buildPurchase({ id: 8, comprador: 48, consumidor: 48, heladera: 4, cuponId: 34, total: 2800, fecha: "2025-09-03T14:03:00", token: "TOK-73597746", estado: "Retirada", items: [{ productoId: 13, cantidad: 1 }] }),
  buildPurchase({ id: 9, comprador: 27, consumidor: 27, heladera: 8, cuponId: 9, total: 1105, fecha: "2025-01-20T12:26:00", token: "TOK-88623924", estado: "Vencida-Reembolsada", items: [{ productoId: 22, cantidad: 1 }] }),
  buildPurchase({ id: 14, comprador: 34, consumidor: 34, heladera: 3, total: 13500, fecha: "2026-05-09T15:12:00", token: "TOK-15220472", estado: "Retirada", items: [{ productoId: 8, cantidad: 3 }] }),
  buildPurchase({ id: 19, comprador: 38, consumidor: 38, heladera: 1, cuponId: 24, total: 2870, fecha: "2025-09-13T08:42:00", token: "TOK-24609539", estado: "Retirada", items: [{ productoId: 25, cantidad: 1 }, { productoId: 22, cantidad: 1 }] }),
  buildPurchase({ id: 23, comprador: 56, consumidor: 34, heladera: 8, total: 13800, fecha: "2026-01-20T09:58:00", token: "TOK-95205852", estado: "Vencida-Reembolsada", items: [{ productoId: 8, cantidad: 2 }, { productoId: 32, cantidad: 1 }] }),
];

// =====================================================================
// COMENTARIOS (subset del SQL — comentarios reales de usuarios sobre productos)
// =====================================================================
type Com = [number, number, number, string, string, number];
const comentariosRaw: Com[] = [
  [1,22,21,"2026-02-26T02:01:00Z","Porción generosa, quedé satisfecho.",5],
  [2,33,10,"2026-02-20T01:19:00Z","Buena porción y sabor casero.",4],
  [3,59,27,"2026-02-02T02:32:00Z","Buena porción y sabor casero.",3],
  [5,26,25,"2026-04-21T18:24:00Z","La heladera tardó en abrir pero el producto estaba perfecto.",5],
  [8,2,28,"2025-01-25T17:00:00Z","Perfecto para comer rápido entre clases.",4],
  [10,51,22,"2026-06-13T17:27:00Z","Excelente relación precio-calidad.",3],
  [13,32,4,"2026-05-31T07:29:00Z","Porción generosa, quedé satisfecho.",5],
  [17,31,2,"2026-03-19T15:50:00Z","Llegó un poco frío pero estaba bueno.",5],
  [22,43,12,"2025-03-18T17:40:00Z","Repetiría sin dudar, excelente sabor.",3],
  [28,6,17,"2025-07-03T18:25:00Z","Ideal para el almuerzo en la facultad.",4],
  [29,27,25,"2025-04-09T22:50:00Z","Repetiría sin dudar, excelente sabor.",5],
  [33,1,32,"2025-05-16T22:58:00Z","Buenísima opción vegetariana.",3],
  [34,12,22,"2026-03-10T05:01:00Z","Excelente relación precio-calidad.",5],
  [38,22,30,"2026-02-27T12:01:00Z","Muy fresco, se nota la calidad de los ingredientes.",3],
  [40,30,21,"2025-12-09T12:23:00Z","Muy rico, lo recomiendo totalmente.",3],
  [42,51,25,"2026-01-05T01:06:00Z","Ideal para el almuerzo en la facultad.",3],
  [44,18,24,"2025-11-17T02:45:00Z","Repetiría sin dudar, excelente sabor.",4],
  [48,10,18,"2026-02-19T03:23:00Z","Porción generosa, quedé satisfecho.",4],
  [51,8,27,"2025-08-11T12:10:00Z","Porción generosa, quedé satisfecho.",4],
  [55,40,13,"2025-03-25T20:38:00Z","Lo pediría de nuevo sin dudarlo.",4],
  [57,27,26,"2025-04-10T22:50:00Z","Muy rico, lo recomiendo totalmente.",5],
  [62,31,17,"2025-12-10T16:41:00Z","La heladera tardó en abrir pero el producto estaba perfecto.",5],
  [65,24,1,"2026-01-28T11:16:00Z","Buena porción y sabor casero.",4],
  [70,8,4,"2025-08-10T20:10:00Z","La heladera tardó en abrir pero el producto estaba perfecto.",5],
  [71,6,3,"2025-10-18T21:08:00Z","Llegó un poco frío pero estaba bueno.",5],
  [75,51,1,"2025-07-15T05:52:00Z","Lo pediría de nuevo sin dudarlo.",5],
  [77,22,7,"2026-05-28T16:57:00Z","Un poco caro para lo que es, pero rico.",5],
  // Comentario propio del demo user (33) para mostrar en historial → review
  [101,33,9,"2025-08-04T13:00:00Z","Excelente para el almuerzo, bien condimentada.",5],
  [102,33,12,"2025-08-04T13:01:00Z","Liviano y rendidor, lo voy a repetir.",4],
];

const userLabel = (uid: number) => {
  const u = usuariosRaw.find((x) => x[0] === uid)!;
  return `${u[1]} ${u[2][0]}.`;
};

export const seedComments: Comment[] = comentariosRaw.map(
  ([id, uid, pid, fecha, texto, rating]) => ({
    id: `com_${id}`,
    userId: `u_${uid}`,
    userName: userLabel(uid),
    productId: `p_${pid}`,
    rating,
    text: texto,
    createdAt: fecha,
  })
);
