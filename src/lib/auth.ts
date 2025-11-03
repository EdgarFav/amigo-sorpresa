// Sistema de autenticación básica usando localStorage
export interface UserSession {
    memberId: string
    memberName: string
    groupId: string
    isHost: boolean
}

export class AuthService {
    private static readonly SESSION_KEY = 'amigo_norpresa_session'

    static setSession(session: UserSession): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
        }
    }

    static getSession(): UserSession | null {
        if (typeof window !== 'undefined') {
            const sessionData = localStorage.getItem(this.SESSION_KEY)
            if (sessionData) {
                try {
                    return JSON.parse(sessionData)
                } catch {
                    this.clearSession()
                    return null
                }
            }
        }
        return null
    }

    static clearSession(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.SESSION_KEY)
        }
    }

    static isLoggedIn(): boolean {
        return this.getSession() !== null
    }

    static isHost(): boolean {
        const session = this.getSession()
        return session?.isHost || false
    }

    static getCurrentMemberId(): string | null {
        const session = this.getSession()
        return session?.memberId || null
    }

    static getCurrentGroupId(): string | null {
        const session = this.getSession()
        return session?.groupId || null
    }
}

// Función para generar códigos de acceso aleatorios
export function generateAccessCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}