/* eslint-disable no-sparse-arrays */
import React from 'react'
import renderer from 'react-test-renderer'
import styled from 'styled-components'

import facepaint from '../src/index'

const mq = facepaint({
  first: '@media(min-width: 420px)',
  second: '@media(min-width: 920px)',
  third: '@media(min-width: 1120px)',
})

describe('facepaint', () => {
  test('basic', () => {
    const Div = styled('div')`
      ${mq({
        color: {
          default: 'red',
          first: 'green',
          second: 'blue',
          third: 'darkorchid',
        },
      })};
    `
    const tree = renderer.create(<Div>Basic</Div>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('holes', () => {
    const Div = styled('div')`
      ${mq({color: {default: 'red', second: 'blue', third: 'darkorchid'}})};
    `
    const tree = renderer.create(<Div>Holes</Div>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('multiple', () => {
    const Div = styled('div')`
      ${mq({
        color: {
          default: 'red',
          first: 'green',
          second: 'blue',
          third: 'darkorchid',
        },
        display: {
          default: 'flex',
          first: 'block',
          second: 'inline-block',
          third: 'table',
        },
        fontSize: '12px',
        alignItems: 'center',
      })};
    `
    const tree = renderer.create(<Div>Multiple</Div>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('nested', () => {
    const Div = styled('div')`
      ${mq({
        backgroundColor: 'hotpink',
        textAlign: 'center',
        width: {default: '25%', first: '50%', second: '75%', third: '100%'},
        '& .foo': {
          color: {
            default: 'red',
            first: 'green',
            second: 'blue',
            third: 'darkorchid',
          },
          '& img': {
            height: {
              default: '10px',
              first: '15px',
              second: '20px',
              third: '25px',
            },
          },
        },
      })};
    `
    const tree = renderer
      .create(
        <Div>
          <div className="foo">foo</div>
          nested
        </Div>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
