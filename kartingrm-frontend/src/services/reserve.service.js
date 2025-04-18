import httpClient from "../http-common";

const API_URL = '/api/v1/reserves/';

const listReserves = () => {
    return httpClient.get(API_URL);
};

const getReserveById = (id) => {
    return httpClient.get(`${API_URL}${id}`);
};

const saveReserve = (reserve) => {
    return httpClient.post(API_URL, reserve);
};

const updateReserve = (reserve) => {
    return httpClient.put(API_URL, reserve);
};

const deleteReserveById = (id) => {
    return httpClient.delete(`${API_URL}${id}`);
};

const listReservesByRutAndMonth = (rut, month) => {
    return httpClient.get(`${API_URL}${rut}/${month}`);
};

const listReservesByDay = (day) => {
    return httpClient.get(`${API_URL}day/${day}`);
};

const listReservesByMonth = (month) => {
    return httpClient.get(`${API_URL}month/${month}`);
};

const listReservesByWeek = (year, month, week) => {
    return httpClient.get(`${API_URL}week/${year}/${month}/${week}`);
};

const sendPaymentReceipt = (id) => {
    return httpClient.get(`${API_URL}${id}/payment-receipt`);
};

const generateTariffReport = (startDate, endDate) => {
    return httpClient.get(`${API_URL}report/tariff`, {
        params: { startDate, endDate },
        responseType: 'blob', // Para manejar archivos descargables
    });
};

const generateGroupSizeReport = (startDate, endDate) => {
    return httpClient.get(`${API_URL}report/group-size`, {
        params: { startDate, endDate },
        responseType: 'blob', // Para manejar archivos descargables
    });
};

const calculateFinalPrice = (reserve) => {
    return httpClient.post("/api/v1/reserves/calculate-price", reserve);
};


export default {
    listReserves,
    getReserveById,
    saveReserve,
    updateReserve,
    deleteReserveById,
    listReservesByRutAndMonth,
    listReservesByDay,
    listReservesByMonth,
    listReservesByWeek,
    sendPaymentReceipt,
    generateTariffReport,
    generateGroupSizeReport,
    calculateFinalPrice,
};

/*
Resumen de funcionalidades a implementar en el sistema de reservas de karting:
RF1. Configuración de Tarifas y Duración de Reservas 
RF2. Descuentos por Número de Personas 
RF3. Descuentos para Clientes Frecuentes 
RF4. Tarifas para Días Especiales  
RF5. Registro de Reservas 
RF6. Comprobante de Pago para Clientes 
RF7. Rack Semanal de Ocupación de la Pista 
RF8. Reporte de Ingresos por Número de Vueltas o Tiempo Máximo 
RF9. Reporte de Ingresos por Número de Personas 
--------------------------------------------------------------------------------------------------
CONTEXTO: 

El negocio de karting establece las tarifas y la duración de las reservas según el número máximo de vueltas o el tiempo en pista, lo que ocurra primero. 
Adicionalmente, cada reserva incluye un tiempo total que considera el uso de los karts en pista y el tiempo necesario para preparación, instrucciones y transición entre clientes. 
Las condiciones son las siguientes: 
Número de vueltas o tiempo máximo permitido : 10 vueltas o máx 10 min | 15 vueltas o máx 15 min | 20 vueltas o máx 20 min
Precios regulares: 15.000 | 20.000 | 25.000
Duración total de la reserva : 30 min | 35 min | 40 min
--------------------------------------------------------------------------------------------------
Descuentos por Número de Personas: 
El negocio de karting ofrece descuentos en función del número de personas incluidas en una reserva grupal. 
Estos descuentos están diseñados para incentivar las reservas en grupo, asegurando un precio competitivo y atractivo para los clientes. 
Las condiciones son las siguientes: 
Número de personas: 1-2 personas | 3-5 personas | 6-10 personas | 11-15 personas
Descuento aplicado: 0% | 10% | 20% | 30%
--------------------------------------------------------------------------------------------------
Descuentos para Clientes Frecuentes Para premiar la fidelidad de los clientes:
el negocio de karting ofrece descuentos especiales basados en la frecuencia con la que visitan el establecimiento durante un mes. 
Las categorías y los descuentos aplicados son los siguientes: 
Categoria de Cliente Frecuente: Muy frecuente | Frecuente | Regular | No frecuente
Número de visitas al mes: 7 a más veces | 5 a 6 veces | 2 a 4 veces | 0 a 1 vez
Descuento aplicado: 30% | 20% | 10% | 0%
--------------------------------------------------------------------------------------------------
Tarifas para Días Especiales: 
El negocio de karting aplica tarifas diferenciadas para días especiales como fines de semana y feriados, debido al incremento en la demanda durante estos días. 
Se definen tarifas para los días de fines de semana (sábado y domingo) y tarifas especiales para determinados días feriados. Por ejemplo, fiestas patrias, navidad, etc. 
--------------------------------------------------------------------------------------------------
Últimamente se tiene la promoción para que personas que “cumplen años” el día que usarán el kartódromo tengan un 50% de descuento especial. 
Este descuento funciona de la siguiente manera, en un grupo de 3 a 5 personas se aplica a una persona que cumple años, en un grupo de 6 a 10 personas se aplica hasta 2 personas que cumplen años.  

--------------------------------------------------------------------------------------------------
Rack Semanal de Ocupación de la Pista: 
El rack semanal se utiliza para llevar un registro de las reservas de la pista del kartódromo. 
Cada fila representa un bloque de tiempo dentro del horario de atención del negocio, 
mientras que las columnas corresponden a los días de la semana. 
Este método permite a los administradores visualizar de manera organizada las reservas realizadas, así como los horarios que aún están disponibles. 
Actualmente el proceso de gestión de este rack se lleva de manera manual en un cuaderno. 
Este proceso consiste en que, cada vez que un cliente realiza una reserva (por teléfono), 
el administrador marca el bloque de tiempo correspondiente en el cuaderno y coloca el nombre de cliente (en el bloque). 
Si se cancela una reserva, el bloque horario se borra. 
El cuaderno del rack permite al administrador verificar rápidamente qué horarios están libres y cuáles están ocupados, facilitando una planificación eficiente. 
En caso de ajustes o cambios en las reservas, el administrador actualiza el cuaderno del rack para reflejar la situación actual de manera precisa. 
--------------------------------------------------------------------------------------------------
Comprobante de Pago para Clientes: 
Al momento de confirmar una reserva, se elabora un comprobante detallado (en Excel) que incluye toda la información relacionada con el pago que deberá realizar.
Este comprobante tiene como objetivo proporcionar claridad y transparencia sobre los costos asociados a la reserva, 
facilitando la revisión y confirmación por parte del cliente. 
El comprobante es enviado por correo electrónico a cada integrante del grupo en formato digital (PDF). 
Este comprobante deberá ser presentado el día que vengan a usar el Kartódromo. 
--------------------------------------------------------------------------------------------------
Detalles Incluidos en el Comprobante: 
• Información de la Reserva: 
    o Código de la reserva o Fecha y hora de la reserva. 
    o Número de vueltas o tiempo máximo reservado. 
    o Cantidad de personas incluidas. o Nombre de persona que se hizo la reserva. 
• Detalle de pago de cada integrante de la reserva (en formato de tabla. Una fila por cada integrante). 
    o Nombre de cliente 
    o Tarifa base aplicada según el número de vueltas/tiempo máximo, o día especial (fines de semana o feriados). 
    o Descuento por el tamaño del grupo, si corresponde. 
    o Descuento por ser cliente frecuente o promociones especiales (como cumpleaños). 
    o Monto final calculado después de aplicar tarifas, descuentos y promociones. 
    o Valor del IVA. 
    o Monto Total incluyendo IVA 
--------------------------------------------------------------------------------------------------
Reportes: 
Actualmente, el negocio de karting elabora manualmente los siguientes reportes para 
realizar un seguimiento de los ingresos generados y analizar el desempeño operativo: 

    - Reporte de ingresos por número de vueltas o tiempo máximo: 
        En este reporte se agrupan los ingresos según las tarifas aplicadas, 
        ya sea por el número de vueltas realizadas (10, 15 o 20 vueltas) o por el tiempo máximo permitido. 
        Esto ayuda a identificar qué opciones de reserva son las más rentables y populares entre los clientes. 

    - Reporte de ingresos por número de personas:
        Este reporte organiza los ingresos según el tamaño de los grupos que realizan reservas (por ejemplo, de 1-3 personas, 4-6 personas, y 7-9 personas)
        brindando información clave sobre cómo las reservas grupales contribuyen al total de ingresos.

--------------------------------------------------------------------------------------------------
Respecto del Frontend: 
Debe ser desarrollado usando ReactJS. 
Se requiere un único frontend para la aplicación. 
Se sugiere desarrollar usando Visual Studio Code. 
--------------------------------------------------------------------------------------------------
5.2 Respecto del Backend:
Debe ser desarrollado usando Spring Boot (dependencias a usar: Spring Web, MySQL/PostgreSQL Driver, Spring Data JPA, Lombok). 
Debe ser implementada en el lenguaje de programación Java usando programación orientada a objetos. 
Debe ser una aplicación web monolítica basada en al patrón arquitectural por capas (layers). 
Debe usar una base de datos relacional (Por ejemplo, MySQL, PostgreSQL, etc.). 
La aplicación debe ser desarrollada usando un IDE (por ejemplo, IntelliJ, VS Code, etc.). 
--------------------------------------------------------------------------------------------------
5.3 Despliegue del producto en producción:
La aplicación web (frontend y backend) debe quedar desplegada 
y totalmente funcionando en un servidor de la nube (AWS, Azure, GCP, Digital Ocean, etc.). 
El despliegue de la aplicación en el servidor se debe realizar manualmente usando Docker Compose. 
Los componentes para desplegar son: 
    - Base de Datos (MySQL/PostgreSQL), 
    - Backend (3 réplicas), 
    - Nginx como balanceador de carga para el backend y el frontend. 
    - Todos estos componentes deben se desplegados desde sus imágenes Docker respectivas (almacenadas en Docker Hub). 
    - La aplicación web debe poder ser accedida desde cualquier navegador web local. 
*/