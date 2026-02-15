import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
 
const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Helvetica' },
    title: { fontSize: 20, marginTop: 10,marginBottom: 5, textAlign: 'center', fontWeight: 'bold' },
    subtitle: { fontSize: 10, marginBottom: 30, textAlign: 'center', fontStyle: 'italic', color: '#666' },
    table: { 
        display: "flex", 
        width: "auto", 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderColor: '#bfbfbf',
        borderBottomWidth: 0,
        borderRightWidth: 0,
    }, 
    tableRow: { 
        flexDirection: "row", 
        borderBottomColor: '#bfbfbf', 
        borderBottomWidth: 1, 
        borderStyle: "solid",
        minHeight: 25, 
        alignItems: 'stretch', 
    }, 
    tableCol: { 
        borderStyle: "solid", 
        borderRightWidth: 1, 
        borderRightColor: '#bfbfbf',
        padding: 5,
        justifyContent: 'center',  
    }, 
    colSmall: { width: '10%', fontWeight: 'bold' },
    colMedium: { width: '15%' },
    colLarge: { width: '50%' },
    isHome: { backgroundColor: '#e6f7ff' },
    tableCell: { 
        fontSize: 8,  
        flexWrap: 'wrap', 
        wordBreak: 'break-all' 
    },
    headerBg: { backgroundColor: '#f0f0f0' },
    bold: { fontWeight: 'bold' },
    done: { textDecoration: 'line-through'}
});

export const CalendarPDF = ({ matches }: { matches: any[] }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={{ padding: 20 }}  >
            <Text style={styles.title}>Calendario Partite 2026</Text>
            <Text style={styles.subtitle}>Aggiornato al {new Date().toLocaleDateString('it-IT')}</Text>
            <View style={styles.table}>
                {/*Table headers*/}
                <View style={[styles.tableRow, styles.headerBg]}>
                    <View style={[styles.tableCol, styles.colSmall]}><Text style={[styles.tableCell, styles.bold]}>Stato</Text></View>
                    <View style={[styles.tableCol, styles.colMedium]}><Text style={[styles.tableCell, styles.bold]}>Data e Ora</Text></View>
                    <View style={[styles.tableCol, styles.colMedium]}><Text style={[styles.tableCell, styles.bold]}>Casa</Text></View>
                    <View style={[styles.tableCol, styles.colMedium]}><Text style={[styles.tableCell, styles.bold]}>Trasferta</Text></View>
                    <View style={[styles.tableCol, styles.colLarge]}><Text style={[styles.tableCell, styles.bold]}>Indirizzo</Text></View>
                </View>
                {/*Table rows*/}
                {matches.map((match, index) => (
                    <View key={index} style={[styles.tableRow, match.IsHome ? styles.isHome : {}, match.Done ? styles.done : {}]}>
                        <View style={[styles.tableCol, styles.colSmall]}><Text style={styles.tableCell}>{match.Done ? "Conclusa" :  (match.ThisWeek ? "Prossima" : "In programma")}</Text></View>
                        <View style={[styles.tableCol, styles.colMedium]}><Text style={styles.tableCell}>{match.Data} {match.Ora}</Text></View>
                        <View style={[styles.tableCol, styles.colMedium]}><Text style={styles.tableCell}>{match.Casa}</Text></View>
                        <View style={[styles.tableCol, styles.colMedium]}><Text style={styles.tableCell}>{match.Trasferta}</Text></View>
                        <View style={[styles.tableCol, styles.colLarge]}><Text style={styles.tableCell}>{match.Indirizzo}</Text></View>
                    </View>
                ))}
            </View> 
        </Page> 
    </Document>
    
);