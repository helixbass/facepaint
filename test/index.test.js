/* eslint-disable no-sparse-arrays */
import React from 'react'
import renderer from 'react-test-renderer'
import {css, sheet, flush, cx} from 'emotion'

import facepaint from '../src/index'

const mq = facepaint(
  {
    first: '@media(min-width: 420px)',
    second: '@media(min-width: 920px)',
    third: '@media(min-width: 1120px)',
    fourth: '@media(min-width: 11200px)',
  },
  {default: 'zero', overlap: true}
)

const pseudo = facepaint({first: ':hover', second: ':active', third: ':focus'})

describe('facepaint', () => {
  afterEach(() => flush())
  test('basic', () => {
    const result = css(
      mq({
        color: {
          zero: 'red',
          first: 'green',
          second: 'blue',
          third: 'darkorchid',
        },
      })
    )
    const tree = renderer.create(<div css={result}>Basic</div>).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('holes', () => {
    const result = css(
      mq({color: {zero: 'red', second: 'blue', third: 'darkorchid'}})
    )
    const tree = renderer.create(<div css={result}>Basic</div>).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('undefined', () => {
    const result = css(
      mq({
        color: {
          zero: 'red',
          first: undefined,
          second: 'blue',
          third: 'darkorchid',
        },
      })
    )
    const tree = renderer.create(<div css={result}>Basic</div>).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('repeating', () => {
    const result = css(
      mq({
        color: {
          zero: 'red',
          first: 'blue',
          third: 'blue',
          fourth: 'darkorchid',
        },
      })
    )
    const tree = renderer.create(<div css={result}>Basic</div>).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('nested arrays', () => {
    const result = css(
      mq([[[[{color: {zero: 'red', first: 'blue', second: 'darkorchid'}}]]]])
    )
    const tree = renderer.create(<div css={result}>Basic</div>).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('multiple', () => {
    const result = css(
      mq({
        color: {
          zero: 'red',
          first: 'green',
          second: 'blue',
          third: 'darkorchid',
        },
        display: {
          zero: 'flex',
          first: 'block',
          second: 'inline-block',
          third: 'table',
        },
        fontSize: 12,
        alignItems: 'center',
      })
    )
    const tree = renderer.create(<div css={result}>multiple</div>).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('nested', () => {
    const result = css(
      mq({
        backgroundColor: 'hotpink',
        textAlign: 'center',
        width: {zero: '25%', first: '50%', second: '75%', third: '100%'},
        '& .foo': {
          color: {
            zero: 'red',
            first: 'green',
            second: 'blue',
            third: 'darkorchid',
          },
          '& img': {
            height: {zero: 10, first: 15, second: 20, third: 25},
          },
        },
      })
    )
    const tree = renderer
      .create(
        <div css={result}>
          <div className="foo">foo</div>
          function
        </div>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('pseudo', () => {
    const result = css(
      pseudo({
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
            height: {default: 10, first: 15, second: 20, third: 25},
          },
        },
      })
    )
    const tree = renderer
      .create(
        <div css={result}>
          <div className="foo">foo</div>
          function
        </div>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('array values with selectors', () => {
    const result = css(
      mq({
        '& .current-index': [
          {
            color: {zero: 'blue', first: 'red'},
          },
          {
            marginRight: 15,
            display: {zero: 'none', first: 'block'},
            letterSpacing: 3,
          },
        ],
      })
    )
    const tree = renderer
      .create(
        <div css={result}>
          <div className="foo">foo</div>
          function
        </div>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('boolean, null, and undefined values', () => {
    const result = css(
      mq(
        {color: 'blue'},
        1 === 2 && {color: 'green'},
        false,
        true,
        undefined,
        null,
        [
          {color: 'red'},
          1 === 2 && {color: 'green'},
          false,
          true,
          undefined,
          null,
        ]
      )
    )

    const tree = renderer
      .create(
        <div css={result}>
          <div className="foo">foo</div>
          function
        </div>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('composition', () => {
    const a = css(mq({background: {zero: 'green', first: 'blue'}}))
    const b = css(mq({background: 'orange'}))
    const c = css(mq({background: {zero: 'orange', first: 'orange'}}))
    const d = css(
      mq({
        background: {
          zero: 'orange',
          first: 'orange',
          second: 'orange',
          third: 'orange',
        },
      })
    )

    const tree = renderer.create(<div css={cx(a, b, c, d)} />).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('more composition', () => {
    const styles1 = css(mq({marginTop: {zero: 1, first: 2}}))
    const styles2 = css(mq({marginTop: {zero: 500, first: 500}}))
    const tree = renderer.create(<div css={cx(styles1, styles2)} />).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('complex overlapped', () => {
    const result = mq({
      color: {zero: 'red', first: 'red', second: 'blue', third: 'darkorchid'},
      background: {
        zero: 'red',
        first: 'green',
        second: 'green',
        third: 'darkorchid',
      },
    })
    expect(result).toMatchSnapshot()
    expect(Object.keys(result[0])).toMatchSnapshot()
  })
})
