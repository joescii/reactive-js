# Express all the things!



describe 'sign', ->
  it 'should work', ->
    expect(sign(-5))
    .toBe "negative"
    expect(sign(0))
    .toBe "zero"
    expect(sign(10))
    .toBe "positive"