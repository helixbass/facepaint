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

const mql = facepaint(
  [
    '@media(min-width: 420px)',
    '@media(min-width: 920px)',
    '@media(min-width: 1120px)',
    '@media(min-width: 11200px)',
  ],
  {literal: true}
)

const pseudo = facepaint([':hover', ':active', ':focus'])

describe('facepaint', () => {
  afterEach(() => flush())
  test('basic', () => {
    console.log({
      res: mq({
        color: {
          zero: 'red',
          first: 'green',
          second: 'blue',
          third: 'darkorchid',
        },
      }),
    })
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
    console.log({tree})
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('holes', () => {
    const result = css(mq({color: ['red', , 'blue', 'darkorchid']}))
    const tree = renderer.create(<div css={result}>Basic</div>).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('undefined', () => {
    const result = css(mq({color: ['red', undefined, 'blue', 'darkorchid']}))
    const tree = renderer.create(<div css={result}>Basic</div>).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('repeating', () => {
    const result = css(
      mq({color: ['red', 'blue', undefined, 'blue', 'darkorchid']})
    )
    const tree = renderer.create(<div css={result}>Basic</div>).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('nested arrays', () => {
    const result = css(mq([[[[{color: ['red', 'blue', 'darkorchid']}]]]]))
    const tree = renderer.create(<div css={result}>Basic</div>).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('multiple', () => {
    const result = css(
      mq({
        color: ['red', 'green', 'blue', 'darkorchid'],
        display: ['flex', 'block', 'inline-block', 'table'],
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
        width: ['25%', '50%', '75%', '100%'],
        '& .foo': {
          color: ['red', 'green', 'blue', 'darkorchid'],
          '& img': {
            height: [10, 15, 20, 25],
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
        width: ['25%', '50%', '75%', '100%'],
        '& .foo': {
          color: ['red', 'green', 'blue', 'darkorchid'],
          '& img': {
            height: [10, 15, 20, 25],
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
            color: ['blue', 'red'],
          },
          {
            marginRight: 15,
            display: ['none', 'block'],
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
    const a = css(mq({background: ['green', 'blue']}))
    const b = css(mq({background: 'orange'}))
    const c = css(mq({background: ['orange', 'orange']}))
    const d = css(mq({background: ['orange', 'orange', 'orange', 'orange']}))

    const tree = renderer.create(<div css={cx(a, b, c, d)} />).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('more composition', () => {
    const styles1 = css(mq({marginTop: [1, 2]}))
    const styles2 = css(mq({marginTop: [500, 500]}))
    const tree = renderer.create(<div css={cx(styles1, styles2)} />).toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('literal 1', () => {
    const result = css(mql({background: ['red']}))
    expect(result).toMatchSnapshot()
    const tree = renderer.create(<div css={result}>foo</div>).toJSON()

    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('literal 2', () => {
    const result = css(mql({background: ['red', 'green']}))
    expect(result).toMatchSnapshot()
    const tree = renderer.create(<div css={result}>foo</div>).toJSON()

    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('literal all', () => {
    const result = css(mql({background: ['red', 'green', 'blue', 'orange']}))
    expect(result).toMatchSnapshot()
    const tree = renderer.create(<div css={result}>foo</div>).toJSON()

    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('literal: prevent unexpected selector', () => {
    const styles1 = css(mql({marginTop: [1, 2]}))
    const styles2 = css(mql({marginTop: [500, 500]}))
    const result = cx(styles1, styles2)
    expect(result).toMatchSnapshot()
    const tree = renderer.create(<div css={result}>foo</div>).toJSON()

    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('complex overlapped', () => {
    const result = mq({
      color: ['red', 'red', 'blue', 'darkorchid'],
      background: ['red', 'green', 'green', 'darkorchid'],
    })
    expect(result).toMatchSnapshot()
    expect(Object.keys(result[0])).toMatchSnapshot()
  })
})
