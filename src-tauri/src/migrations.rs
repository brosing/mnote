use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE IF NOT EXISTS note_history (
                id TEXT PRIMARY KEY,
                content TEXT NOT NULL,
                createdAt INTEGER NOT NULL,
                updatedAt INTEGER NOT NULL
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "add_updatedAt_column",
            sql: "SELECT CASE 
                    WHEN COUNT(*) = 0 THEN
                        'ALTER TABLE note_history ADD COLUMN updatedAt INTEGER;'
                    ELSE
                        'SELECT 1;'
                END as sql_to_execute
                FROM pragma_table_info('note_history')
                WHERE name = 'updatedAt';",
            kind: MigrationKind::Up,
        },
    ]
}
