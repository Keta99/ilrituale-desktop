const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { app } = require('electron');
const dbPath = path.join(app.getPath('userData'), 'db.db');


const createDatabaseIfNotExists = async () => {
  try {
    const dbExists = fs.existsSync(dbPath);
    if (!dbExists) {
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          throw new Error(`Errore durante la creazione del database: ${err}`);
        } else {
          console.log('Database creato correttamente');
        }
      });
      db.serialize(() => {
        /* db.run(`CREATE TABLE IF NOT EXISTS user (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           name TEXT
         )`);*/
        db.run(`CREATE TABLE IF NOT EXISTS prenotazioni (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          cliente TEXT,
          note TEXT,
          dataOraInizio TEXT,
          dataOraFine TEXT,
          cellulare TEXT,
          recurringGruppId INTEGER,
          recurring BOOLEAN,
          frequenza INTEGER
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS clienti (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT
        )`);
      });

      db.close();

      console.log(`Il file del database ${dbPath} è stato creato`);
    } else {
      console.log(`Il file del database ${dbPath} esiste già`);
    }
  } catch (error) {
    console.error('Errore durante la creazione del database:', error);
    throw error;
  }
}
const connectDatabase = async () => {
  let db;
  try {
    await createDatabaseIfNotExists(); // Controlla se il file del database esiste, altrimenti lo crea

    // Connessione al database
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        throw new Error(`Errore durante l'apertura del database: ${err}`);
      } else {
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

const selectClienti = async () => {
  let db;
  try {
    db = await connectDatabase();
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM clienti', (err, rows) => {
        if (err) {
          console.error('Errore durante l\'esecuzione della query:', err);
          reject(err);
        } else {
          console.log('Risultati della SELECT: ');
          rows.forEach((row) => {
            console.log(row);
          });
          resolve(rows);
        }
      });
    });
    db.close();
    return rows;
  } catch (error) {
    console.error('Errore durante l\'esecuzione della query:', error);
    if (db) {
      db.close();
    }
    throw error;
  }
};

const selectClientiByNome = async (nome) => {
  let db;
  try {
    db = await connectDatabase();
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM clienti WHERE clienti.nome = ?',[nome],  (err, rows) => {
        if (err) {
          console.error('Errore durante l\'esecuzione della query:', err);
          reject(err);
        } else {
          console.log(`Risultati della SELECT ${nome} `  );
          rows.forEach((row) => {
            console.log(row);
            console.log("!row",!row);
          });
          resolve(rows);
        }
      });
    });
    db.close();
    return rows;
  } catch (error) {
    console.error('Errore durante l\'esecuzione della query:', error);
    if (db) {
      db.close();
    }
    throw error;
  }
};


const insertCliente = async (cliente) => {
  let db;
  try {
    db = await connectDatabase();
    await new Promise((resolve, reject) => {
      db.run(`INSERT INTO clienti (name) 
      VALUES (?)`,
        [cliente.name],
        function (err) {
          if (err) {
            console.error('Errore durante l\'inserimento del CLIENTE:', err.message);
            reject(err);
          } else {
            console.log(`Nuovo cliente inserito con ID: ${this.lastID}`);
            resolve(this.lastID);
          }
        });
    });
    db.close();
  } catch (error) {
    console.error('Errore durante l\'inserimento della prenotazione:', error);
    if (db) {
      db.close();
    }
    throw error;
  }

};



const SelectPrenotazioni = async () => {
  let db;
  try {
    db = await connectDatabase();
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM prenotazioni', (err, rows) => {
        if (err) {
          console.error('Errore durante l\'esecuzione della query:', err);
          reject(err);
        } else {
          console.log('Risultati della SELECT:');
          rows.forEach((row) => {
            console.log("result db", row);
          });

          resolve(rows);
        }
      });
    });
    db.close();
    return rows;
  } catch (error) {
    console.error('Errore durante l\'esecuzione della query:', error);
    if (db) {
      db.close();
    }
    throw error;
  }
};



const insertPrenotazione = async (prenotazione) => {
  let db;
  try {
    db = await connectDatabase();
    await new Promise((resolve, reject) => {
      db.run(`INSERT INTO prenotazioni (name, cliente, tipologia, dataOraInizio, dataOraFine, cellulare, recurringGruppId, recurring, frequenzaRicorrenza) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [prenotazione.name, prenotazione.cliente, prenotazione.tipologia, app.dataOraInizio,
        app.dataOraFine, prenotazione.cellulare, prenotazione.recurringGruppId, prenotazione.recurring, prenotazione.frequenzaRicorrenza],
        function (err) {
          if (err) {
            console.error('Errore durante l\'inserimento della prenotazione:', err.message);
            reject(err);
          } else {
            console.log(`Nuova prenotazione inserita con ID: ${this.lastID}`);
            resolve(this.lastID);
          }
        });
    });
    db.close();
  } catch (error) {
    console.error('Errore durante l\'inserimento della prenotazione:', error);
    if (db) {
      db.close();
    }
    throw error;
  }
};
const deletePrenotazione = async (id) => {
  let db;
  try {
    db = await connectDatabase();
    await new Promise((resolve, reject) => {
      db.run(`DELETE FROM prenotazioni WHERE id = ?`, [id], function (err) {
        if (err) {
          console.error('Errore durante l\'eliminazione della prenotazione :', err.message);
          reject(err);
        } else {
          console.log(`Prenotazione eliminata con ID: ${id}`);
          resolve();
        }
      });
    });
    db.close();
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'utente:', error);
    if (db) {
      db.close();
    }
    throw error;
  }
};
const closeDatabase = async () => {
  let db;
  try {
    db = await connectDatabase();
    await new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) {
          console.error('Errore durante la chiusura del database:', err);
          reject(err);
        } else {
          console.log('Database chiuso correttamente');
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Errore durante la chiusura del database:', error);
    if (db) {
      db.close();
    }
    throw error;
  }
};

module.exports = {
  connectDatabase,
  selectClienti,
  selectClientiByNome,
  insertCliente,
  SelectPrenotazioni,
  insertPrenotazione,
  deletePrenotazione,
  closeDatabase
};