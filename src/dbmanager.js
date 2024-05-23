const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Percorso del database
const dbPath = path.resolve('db.db');
//const dbPath = path.resolve(__dirname, 'db.db');
const createDatabaseIfNotExists = async () => {
  try {
    // Verifica se il file del database esiste
    const dbExists = fs.existsSync(dbPath);
    if (!dbExists) {
      // Se il file non esiste, crea il database
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          throw new Error(`Errore durante la creazione del database: ${err}`);
        } else {
          console.log('Database creato correttamente');
        }
      });

      // Creazione della tabella utente se non esiste
      db.serialize(() => {
       /* db.run(`CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
        )`);*/
        db.run(`CREATE TABLE IF NOT EXISTS prenotazioni (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          cliente TEXT,
          tipologia TEXT,
          data TEXT,
          oraInizio TEXT,
          oraFine TEXT,
          cellulare TEXT
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS cliente (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT
        )`);
      });


      // Chiudi la connessione al database dopo la creazione
      db.close();

      console.log(`Il file del database ${dbPath} è stato creato`);
    } else {
      console.log(`Il file del database ${dbPath} esiste già`);
    }
  } catch (error) {
    console.error('Errore durante la creazione del database:', error);
    throw error;
  }
};

const connectDatabase = async () => {
  let db;
  try {
    await createDatabaseIfNotExists(); // Controlla se il file del database esiste, altrimenti lo crea

    // Connessione al database
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        throw new Error(`Errore durante l'apertura del database: ${err}`);
      } else {
       
        console.log(db);
        console.log('Database aperto correttamente');
      }
    });

    return db; // Restituisci il riferimento al database
  } catch (error) {
    console.error('Errore durante la connessione al database:', error);
    if (db) {
      db.close(); // Chiudi il database in caso di errore
    }
    throw error;
  }
};

const selectUsers = async () => {
  let db;
  try {
    db = await connectDatabase();
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM user', (err, rows) => {
        if (err) {
          console.error('Errore durante l\'esecuzione della query:', err);
          reject(err); // Se si verifica un errore, rifiuta la Promise
        } else {
          // rows conterrà i risultati della query
          console.log('Risultati della SELECT:');
          rows.forEach((row) => {
            console.log(row); // Stampa ogni riga
          });
          resolve(rows); // Risolve la Promise con le righe restituite
        }
      });
    });
    db.close();
    return rows; // Restituisci le righe ottenute dalla query
  } catch (error) {
    console.error('Errore durante l\'esecuzione della query:', error);
    if (db) {
      db.close(); // Chiudi il database in caso di errore
    }
    throw error; // Rilancia l'errore per gestirlo al livello superiore
  }
};
const SelectPrenotazione = async () => {
  let db;
  try {
    db = await connectDatabase();
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM prenotazioni', (err, rows) => {
        if (err) {
          console.error('Errore durante l\'esecuzione della query:', err);
          reject(err); // Se si verifica un errore, rifiuta la Promise
        } else {
          // rows conterrà i risultati della query
          console.log('Risultati della SELECT:');
          rows.forEach((row) => {
            console.log("result db",row); // Stampa ogni riga
          });
          
          resolve(rows); // Risolve la Promise con le righe restituite
        }
      });
    });
    db.close();
    return rows; // Restituisci le righe ottenute dalla query
  } catch (error) {
    console.error('Errore durante l\'esecuzione della query:', error);
    if (db) {
      db.close(); // Chiudi il database in caso di errore
    }
    throw error; // Rilancia l'errore per gestirlo al livello superiore
  }
};
// Funzione per l'inserimento di una prenotazione nel database
const insertPrenotazione = async (prenotazione) => {
  let db;
  try {
    db = await connectDatabase();
    await new Promise((resolve, reject) => {
      db.run(`INSERT INTO prenotazioni (name, cliente, tipologia, data, oraInizio, oraFine, cellulare) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`, 
             [prenotazione.name, prenotazione.cliente, prenotazione.tipologia, prenotazione.data, 
              prenotazione.oraInizio, prenotazione.oraFine, prenotazione.cellulare], 
             function(err) {
        if (err) {
          console.error('Errore durante l\'inserimento della prenotazione:', err.message);
          reject(err); // Se si verifica un errore, rifiuta la Promise
        } else {
          console.log(`Nuova prenotazione inserita con ID: ${this.lastID}`);
          resolve(this.lastID); // Risolve la Promise con l'ID della prenotazione inserita
        }
      });
    });
    db.close();
  } catch (error) {
    console.error('Errore durante l\'inserimento della prenotazione:', error);
    if (db) {
      db.close(); // Chiudi il database in caso di errore
    }
    throw error; // Rilancia l'errore per gestirlo al livello superiore
  }
};
// Funzione per l'inserimento di un utente nel database
const insertUser = async (name) => {
  let db;
  try {
    db = await connectDatabase();
    await new Promise((resolve, reject) => {
      db.run(`INSERT INTO user (name) VALUES (?)`, [name], function(err) {
        if (err) {
          console.error('Errore durante l\'inserimento dell\'utente:', err.message);
          reject(err); // Se si verifica un errore, rifiuta la Promise
        } else {
          console.log(`Nuovo utente inserito con ID: ${this.lastID}`);
          resolve(this.lastID); // Risolve la Promise con l'ID dell'utente inserito
        }
      });
    });
    db.close();
  } catch (error) {
    console.error('Errore durante l\'inserimento dell\'utente:', error);
    if (db) {
      db.close(); // Chiudi il database in caso di errore
    }
    throw error; // Rilancia l'errore per gestirlo al livello superiore
  }
};

// Funzione asincrona per l'eliminazione di un utente dal database
const deleteUser = async (id) => {
  let db;
  try {
    db = await connectDatabase();
    await new Promise((resolve, reject) => {
      db.run(`DELETE FROM user WHERE id = ?`, [id], function(err) {
        if (err) {
          console.error('Errore durante l\'eliminazione dell\'utente:', err.message);
          reject(err); // Se si verifica un errore, rifiuta la Promise
        } else {
          console.log(`Utente eliminato con ID: ${id}`);
          resolve(); // Risolve la Promise quando l'eliminazione è completata
        }
      });
    });
    db.close();
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'utente:', error);
    if (db) {
      db.close(); // Chiudi il database in caso di errore
    }
    throw error; // Rilancia l'errore per gestirlo al livello superiore
  }
};
// Funzione asincrona per la chiusura del database
const closeDatabase = async () => {
  let db;
  try {
    db = await connectDatabase();
    await new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) {
          console.error('Errore durante la chiusura del database:', err);
          reject(err); // Se si verifica un errore, rifiuta la Promise
        } else {
          console.log('Database chiuso correttamente');
          resolve(); // Risolve la Promise quando la
        }
      });
      });
      } catch (error) {
      console.error('Errore durante la chiusura del database:', error);
      if (db) {
      db.close(); // Chiudi il database in caso di errore
      }
      throw error; // Rilancia l'errore per gestirlo al livello superiore
      }
      };
      
      module.exports = { 
        connectDatabase, 
        selectUsers, 
        SelectPrenotazione,
        insertPrenotazione,
        insertUser, deleteUser, closeDatabase };