/**
 * Smoking Repository Implementation
 * Implements ISmokingRepository using SQLite database
 */

import { ISmokingRepository } from '../../domain/repositories/ISmokingRepository';
import { SmokingSession } from '../../domain/entities/SmokingSess';
import { DailyStats, createDailyStats } from '../../domain/entities/DailyStats';
import { SQLiteDatabase } from '../database/SQLiteDataBase';
import { mapSessionToDTO, mapDTOToSession } from '../../application/mappers/SmokingSessionMapper';
import { formatDateToString } from '../../core/utils/dateHelpers';

export class SmokingRepository implements ISmokingRepository {
    private db = SQLiteDatabase.getInstance().getDatabase();

    async addSession(session: SmokingSession): Promise<void> {
        const dto = mapSessionToDTO(session);

        // react-native-quick-sqlite: execute() is synchronous, no await needed
        this.db.execute(
            `INSERT INTO smoking_sessions 
       (entry_id, user_id, timestamp, cigarette_brand, cigarette_type, puffs_count, is_complete, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                dto.entry_id,
                dto.user_id,
                dto.timestamp,
                dto.cigarette_brand,
                dto.cigarette_type,
                dto.puffs_count,
                dto.is_complete,
                dto.notes || null,
                dto.created_at,
            ]
        );
    }

    async getSessionsByUserId(userId: string): Promise<SmokingSession[]> {
        // react-native-quick-sqlite: execute() returns QueryResult
        // rows can be accessed as an array or using _array property
        const results = this.db.execute(
            'SELECT * FROM smoking_sessions WHERE user_id = ? ORDER BY timestamp DESC',
            [userId]
        );

        const sessions: SmokingSession[] = [];
        // Access rows as array - react-native-quick-sqlite returns rows as array-like object
        if (!results.rows) {
            return sessions;
        }
        const rows = results.rows._array || results.rows;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            sessions.push(mapDTOToSession(row));
        }

        return sessions;
    }

    async getSessionsByDate(userId: string, date: string): Promise<SmokingSession[]> {
        const results = this.db.execute(
            `SELECT * FROM smoking_sessions 
       WHERE user_id = ? AND DATE(timestamp) = ? 
       ORDER BY timestamp DESC`,
            [userId, date]
        );

        const sessions: SmokingSession[] = [];
        // Access rows as array
        if (!results.rows) {
            return sessions;
        }
        const rows = results.rows._array || results.rows;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            sessions.push(mapDTOToSession(row));
        }

        return sessions;
    }

    async getSessionsByDateRange(
        userId: string,
        startDate: string,
        endDate: string
    ): Promise<SmokingSession[]> {
        const results = this.db.execute(
            `SELECT * FROM smoking_sessions 
       WHERE user_id = ? AND DATE(timestamp) BETWEEN ? AND ? 
       ORDER BY timestamp DESC`,
            [userId, startDate, endDate]
        );

        const sessions: SmokingSession[] = [];
        // Access rows as array
        if (!results.rows) {
            return sessions;
        }
        const rows = results.rows._array || results.rows;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            sessions.push(mapDTOToSession(row));
        }

        return sessions;
    }

    async getDailyStats(userId: string, date: string): Promise<DailyStats | null> {
        const sessions = await this.getSessionsByDate(userId, date);

        if (sessions.length === 0) {
            return null;
        }

        return this.calculateDailyStats(userId, date, sessions);
    }

    async getDailyStatsRange(
        userId: string,
        startDate: string,
        endDate: string
    ): Promise<DailyStats[]> {
        const sessions = await this.getSessionsByDateRange(userId, startDate, endDate);

        // Group sessions by date
        const sessionsByDate: Record<string, SmokingSession[]> = {};
        sessions.forEach(session => {
            const date = formatDateToString(session.timestamp);
            if (!sessionsByDate[date]) {
                sessionsByDate[date] = [];
            }
            sessionsByDate[date].push(session);
        });

        // Calculate stats for each date
        const stats: DailyStats[] = [];
        for (const [date, dateSessions] of Object.entries(sessionsByDate)) {
            stats.push(this.calculateDailyStats(userId, date, dateSessions));
        }

        return stats.sort((a, b) => a.date.localeCompare(b.date));
    }

    async deleteSession(entryId: string): Promise<void> {
        this.db.execute('DELETE FROM smoking_sessions WHERE entry_id = ?', [entryId]);
    }

    async updateSession(session: SmokingSession): Promise<void> {
        const dto = mapSessionToDTO(session);

        this.db.execute(
            `UPDATE smoking_sessions 
       SET timestamp = ?, cigarette_brand = ?, cigarette_type = ?, 
           puffs_count = ?, is_complete = ?, notes = ?
       WHERE entry_id = ?`,
            [
                dto.timestamp,
                dto.cigarette_brand,
                dto.cigarette_type,
                dto.puffs_count,
                dto.is_complete,
                dto.notes || null,
                dto.entry_id,
            ]
        );
    }

    /**
     * Calculate daily stats from sessions
     */
    private calculateDailyStats(
        userId: string,
        date: string,
        sessions: SmokingSession[]
    ): DailyStats {
        let totalCigarettes = 0;
        let totalPuffs = 0;
        const brandBreakdown: Record<string, number> = {};
        const hourlyBreakdown: Record<number, number> = {};

        sessions.forEach(session => {
            if (session.isComplete) {
                totalCigarettes += 1;
            } else {
                totalPuffs += session.puffsCount;
            }

            brandBreakdown[session.cigaretteBrand] =
                (brandBreakdown[session.cigaretteBrand] || 0) + 1;

            const hour = new Date(session.timestamp).getHours();
            hourlyBreakdown[hour] = (hourlyBreakdown[hour] || 0) + 1;
        });

        return createDailyStats(
            date,
            userId,
            totalCigarettes,
            totalPuffs,
            false, // limitExceeded will be calculated elsewhere
            brandBreakdown,
            hourlyBreakdown
        );
    }
}

