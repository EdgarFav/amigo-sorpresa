import { generateAccessCode } from '../auth'

describe('generateAccessCode', () => {
  it('should generate a 6 character code', () => {
    const code = generateAccessCode()
    expect(code).toHaveLength(6)
  })

  it('should generate a code with only alphanumeric characters', () => {
    const code = generateAccessCode()
    expect(code).toMatch(/^[A-Z0-9]+$/)
  })

  it('should generate different codes on subsequent calls', () => {
    const code1 = generateAccessCode()
    const code2 = generateAccessCode()
    const code3 = generateAccessCode()
    
    // It's extremely unlikely (but not impossible) that all three are the same
    // With 36^6 possible combinations, this test should pass consistently
    const allSame = code1 === code2 && code2 === code3
    expect(allSame).toBe(false)
  })
})
