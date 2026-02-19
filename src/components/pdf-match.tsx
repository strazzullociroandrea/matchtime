import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { PartitaVolley } from "@/lib/schemas/match-schema";

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica" },
  title: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 30,
    textAlign: "center",
    fontStyle: "italic",
    color: "#666",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#bfbfbf",
    borderBottomWidth: 1,
    borderStyle: "solid",
    minHeight: 25,
    alignItems: "stretch",
  },
  tableCol: {
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#bfbfbf",
    padding: 5,
    justifyContent: "center",
  },
  colSmall: { width: "10%", fontWeight: "bold" },
  colMedium: { width: "15%" },
  colLarge: { width: "50%" },
  isHome: { backgroundColor: "#e6f7ff" },
  tableCell: {
    fontSize: 8,
    flexWrap: "wrap",
    wordBreak: "break-all",
  },
  headerBg: { backgroundColor: "#f0f0f0" },
  bold: { fontWeight: "bold" },
  done: { textDecoration: "line-through" },
  footer: {
    fontSize: 6,
    position: "absolute",
    bottom: 10,
    marginLeft: 10,
    marginRight: 50,
  },
});

export const CalendarPDF = ({
  matches,
  category,
  team,
}: {
  matches: PartitaVolley[];
  category: string;
  team: string;
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={{ padding: 20 }}>
      <Text style={styles.title}>Calendario Partite 2026</Text>
      <Text style={styles.subtitle}>
        Categoria: {category} - Squadra: {team}
      </Text>
      <View style={styles.table}>
        {/*Table headers*/}
        <View style={[styles.tableRow, styles.headerBg]}>
          <View style={[styles.tableCol, styles.colSmall]}>
            <Text style={[styles.tableCell, styles.bold]}>Stato</Text>
          </View>
          <View style={[styles.tableCol, styles.colMedium]}>
            <Text style={[styles.tableCell, styles.bold]}>Data e Ora</Text>
          </View>
          <View style={[styles.tableCol, styles.colMedium]}>
            <Text style={[styles.tableCell, styles.bold]}>Casa</Text>
          </View>
          <View style={[styles.tableCol, styles.colMedium]}>
            <Text style={[styles.tableCell, styles.bold]}>Trasferta</Text>
          </View>
          <View style={[styles.tableCol, styles.colLarge]}>
            <Text style={[styles.tableCell, styles.bold]}>Indirizzo</Text>
          </View>
        </View>
        {/*Table rows*/}
        {matches.length === 0 ? (
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "100%" }]}>
              <Text style={styles.tableCell}>Nessuna partita trovata</Text>
            </View>
          </View>
        ) : (
          matches.map((match, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                match.isHome ? styles.isHome : {},
                match.done ? styles.done : {},
              ]}
            >
              <View style={[styles.tableCol, styles.colSmall]}>
                <Text style={styles.tableCell}>
                  {match.data && match.ora
                    ? match.done
                      ? "Conclusa"
                      : match.thisWeek
                        ? "Prossima"
                        : "In programma"
                    : "Rinviata"}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.colMedium]}>
                <Text style={styles.tableCell}>
                  {match.data} {match.ora}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.colMedium]}>
                <Text style={styles.tableCell}>{match.casa}</Text>
              </View>
              <View style={[styles.tableCol, styles.colMedium]}>
                <Text style={styles.tableCell}>{match.trasferta}</Text>
              </View>
              <View style={[styles.tableCol, styles.colLarge]}>
                <Text style={styles.tableCell}>{match.indirizzo}</Text>
              </View>
            </View>
          ))
        )}
      </View>
      <View style={styles.footer}>
        <Text style={{ marginBottom: 2 }}>
          Questo sito è un progetto indipendente e non ufficiale. I dati dei
          calendari sono di proprietà di PGS (Polisportive Giovanili Salesiane),
          recuperati tramite file excel reso disponbile dagli stessi.
          L&apos;autore non si assume responsabilità per eventuali inesattezze o
          cambiamenti di orario non riportati. Consultare sempre il portale
          ufficiale per le comunicazioni formali.
        </Text>
        <Text>Last Update: {new Date().toLocaleDateString("it-IT")}</Text>
      </View>
    </Page>
  </Document>
);
