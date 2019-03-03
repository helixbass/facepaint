import {isPlainObject, each} from 'lodash'

/* eslint-disable no-param-reassign */
export default function(
  breakpoints,
  {overlap, default: defaultKey = 'default'} = {}
) {
  const mq = Object.assign({[defaultKey]: '&'}, breakpoints)

  function flatten(obj) {
    if (typeof obj !== 'object' || obj == null) {
      return []
    }

    if (Array.isArray(obj)) {
      return obj.map(flatten)
    }

    const slots = {}
    const objects = {}
    const props = {}
    Object.keys(obj).forEach(key => {
      // Check if value is an array, but skip if it looks like a selector.
      // key.indexOf('&') === 0

      let item = obj[key]

      if (isPlainObject(item) && key.charCodeAt(0) !== 38) {
        let prior
        each(item, (v, mqKey) => {
          // Optimize by removing duplicated media query entries
          // when they are explicitly known to overlap.
          if (overlap && prior === v) {
            return
          }

          if (v == null) {
            // Do not create entries for undefined values as this will
            // generate empty media media quries
            return
          }

          prior = v

          if (mqKey === defaultKey) {
            props[key] = v
          } else if (slots[mq[mqKey]] === undefined) {
            slots[mq[mqKey]] = {[key]: v}
          } else {
            slots[mq[mqKey]][key] = v
          }
        })
      } else if (typeof item === 'object') {
        objects[key] = flatten(item)
      } else {
        props[key] = item
      }
    })

    // Ensure that all slots and then child objects are pushed to the end
    each(mq, el => {
      if (slots[el]) {
        props[el] = slots[el]
      }
    })
    Object.assign(props, objects)
    return props
  }

  return (...values) => values.map(flatten)
}
