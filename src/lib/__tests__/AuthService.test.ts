import { AuthService, UserSession } from '../auth'

describe('AuthService', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {}

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString()
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
    }
  })()

  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    localStorageMock.clear()
  })

  afterEach(() => {
    localStorageMock.clear()
  })

  describe('setSession and getSession', () => {
    it('should store and retrieve a session', () => {
      const session: UserSession = {
        memberId: '123',
        memberName: 'Test User',
        groupId: 'abc',
        isHost: true,
      }

      AuthService.setSession(session)
      const retrieved = AuthService.getSession()

      expect(retrieved).toEqual(session)
    })

    it('should return null when no session exists', () => {
      const session = AuthService.getSession()
      expect(session).toBeNull()
    })

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.setItem('amigo_norpresa_session', 'invalid json')
      const session = AuthService.getSession()
      expect(session).toBeNull()
    })
  })

  describe('clearSession', () => {
    it('should remove the session from localStorage', () => {
      const session: UserSession = {
        memberId: '123',
        memberName: 'Test User',
        groupId: 'abc',
        isHost: false,
      }

      AuthService.setSession(session)
      expect(AuthService.getSession()).toEqual(session)

      AuthService.clearSession()
      expect(AuthService.getSession()).toBeNull()
    })
  })

  describe('isLoggedIn', () => {
    it('should return true when a session exists', () => {
      const session: UserSession = {
        memberId: '123',
        memberName: 'Test User',
        groupId: 'abc',
        isHost: false,
      }

      AuthService.setSession(session)
      expect(AuthService.isLoggedIn()).toBe(true)
    })

    it('should return false when no session exists', () => {
      expect(AuthService.isLoggedIn()).toBe(false)
    })
  })

  describe('isHost', () => {
    it('should return true when user is host', () => {
      const session: UserSession = {
        memberId: '123',
        memberName: 'Test User',
        groupId: 'abc',
        isHost: true,
      }

      AuthService.setSession(session)
      expect(AuthService.isHost()).toBe(true)
    })

    it('should return false when user is not host', () => {
      const session: UserSession = {
        memberId: '123',
        memberName: 'Test User',
        groupId: 'abc',
        isHost: false,
      }

      AuthService.setSession(session)
      expect(AuthService.isHost()).toBe(false)
    })

    it('should return false when no session exists', () => {
      expect(AuthService.isHost()).toBe(false)
    })
  })

  describe('getCurrentMemberId', () => {
    it('should return member ID when session exists', () => {
      const session: UserSession = {
        memberId: '123',
        memberName: 'Test User',
        groupId: 'abc',
        isHost: false,
      }

      AuthService.setSession(session)
      expect(AuthService.getCurrentMemberId()).toBe('123')
    })

    it('should return null when no session exists', () => {
      expect(AuthService.getCurrentMemberId()).toBeNull()
    })
  })

  describe('getCurrentGroupId', () => {
    it('should return group ID when session exists', () => {
      const session: UserSession = {
        memberId: '123',
        memberName: 'Test User',
        groupId: 'abc',
        isHost: false,
      }

      AuthService.setSession(session)
      expect(AuthService.getCurrentGroupId()).toBe('abc')
    })

    it('should return null when no session exists', () => {
      expect(AuthService.getCurrentGroupId()).toBeNull()
    })
  })
})
