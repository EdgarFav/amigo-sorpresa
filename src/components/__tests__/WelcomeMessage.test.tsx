import { render, screen } from '@testing-library/react'
import WelcomeMessage from '../WelcomeMessage'
import { AuthService } from '@/lib/auth'

// Mock AuthService
jest.mock('@/lib/auth', () => ({
  AuthService: {
    getSession: jest.fn(),
    isHost: jest.fn(),
  },
}))

describe('WelcomeMessage', () => {
  const mockProps = {
    groupName: 'Test Group',
    hostName: 'Test Host',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render nothing when no session exists', () => {
    (AuthService.getSession as jest.Mock).mockReturnValue(null)
    
    const { container } = render(<WelcomeMessage {...mockProps} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render host welcome message when user is host', () => {
    (AuthService.getSession as jest.Mock).mockReturnValue({
      memberId: '1',
      memberName: 'Host User',
      groupId: 'group-1',
      isHost: true,
    })
    ;(AuthService.isHost as jest.Mock).mockReturnValue(true)

    render(<WelcomeMessage {...mockProps} />)

    expect(screen.getByText('👑')).toBeInTheDocument()
    expect(screen.getByText('¡Bienvenido, Organizador!')).toBeInTheDocument()
    expect(screen.getByText(/Desde aquí puedes administrar tu grupo/)).toBeInTheDocument()
    expect(screen.getByText(/Test Group/)).toBeInTheDocument()
  })

  it('should render member welcome message when user is not host', () => {
    (AuthService.getSession as jest.Mock).mockReturnValue({
      memberId: '2',
      memberName: 'Member User',
      groupId: 'group-1',
      isHost: false,
    })
    ;(AuthService.isHost as jest.Mock).mockReturnValue(false)

    render(<WelcomeMessage {...mockProps} />)

    expect(screen.getByText('🎉')).toBeInTheDocument()
    expect(screen.getByText('¡Hola, Member User!')).toBeInTheDocument()
    expect(screen.getByText(/Te has unido exitosamente al grupo/)).toBeInTheDocument()
    expect(screen.getByText(/Test Group/)).toBeInTheDocument()
    expect(screen.getByText(/Test Host/)).toBeInTheDocument()
  })
})
