What are Server Functions?
Server functions allow you to specify logic that can be invoked almost anywhere (even the client), but run only on the server. In fact, they are not so different from an API Route, but with a few key differences:

They are not publicly accessible via HTTP
They can be called from many places in your application, including loaders, hooks, components, etc.
However, they are similar to regular API Routes in that:

They have access to the request context, allowing you to read headers, set cookies, and more
They can access sensitive information, such as environment variables, without exposing them to the client
They can be used to perform any kind of server-side logic, such as fetching data from a database, sending emails, or interacting with other services
They can return any value, including primitives, JSON-serializable objects, and even raw Response objects
They can throw errors, including redirects and notFounds, which can be handled automatically by the router
How are server functions different from "React Server Functions"?

TanStack Server Functions are not tied to a specific front-end framework, and can be used with any front-end framework or none at all.
TanStack Server Functions are backed by standard HTTP requests and can be called as often as you like without suffering from serial-execution bottlenecks.
How do they work?
Server functions can be defined anywhere in your application, but must be defined at the top level of a file. They can be called throughout your application, including loaders, hooks, etc. Traditionally, this pattern is known as a Remote Procedure Call (RPC), but due to the isomorphic nature of these functions, we refer to them as server functions.

On the server bundle, server functions logic is left alone. Nothing needs to be done since they are already in the correct place.
On the client, server functions will be removed; they exist only on the server. Any calls to the server function on the client will be replaced with a fetch request to the server to execute the server function, and send the response back to the client.
Server Function Middleware
Server functions can use middleware to share logic, context, common operations, prerequisites, and much more. To learn more about server function middleware, be sure to read about them in the Middleware guide.
Defining Server Functions
We'd like to thank the tRPC team for both the inspiration of TanStack Start's server function design and guidance while implementing it. We love (and recommend) using tRPC for API Routes so much that we insisted on server functions getting the same 1st class treatment and developer experience. Thank you!

Server functions are defined with the createServerFn function, from the @tanstack/start package. This function takes an optional options argument for specifying the http verb, and allows you to chain off the result to define things like the body of the server function, input validation, middleware, etc. Here's a simple example:

tsx

// getServerTime.ts
import { createServerFn } from '@tanstack/start'

export const getServerTime = createServerFn().handler(async () => {
  // Wait for 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // Return the current time
  return new Date().toISOString()
})
Where can I call server functions?
From server-side code
From client-side code
From other server functions
Warning
Server functions cannot be called from API Routes. If you need to share business logic between server functions and API Routes, extract the shared logic into utility functions that can be imported by both.
Accepting Parameters
Server functions accept a single parameter, which can be a variety of types:

Standard JavaScript types
string
number
boolean
null
Array
Object
FormData
ReadableStream (of any of the above)
Promise (of any of the above)
Here's an example of a server function that accepts a simple string parameter:

tsx

import { createServerFn } from '@tanstack/start'

export const greet = createServerFn({
  method: 'GET',
})
  .validator((data: string) => data)
  .handler(async (ctx) => {
    return `Hello, ${ctx.data}!`
  })

greet({
  data: 'John',
})
Runtime Input Validation / Type Safety
Server functions can be configured to validate their input data at runtime, while adding type safety. This is useful for ensuring the input is of the correct type before executing the server function, and providing more friendly error messages.

This is done with the validator method. It will accept whatever input is passed to the server function. The value (and type) you return from this function will become the input passed to the actual server function handler.

Validators also integrate seamlessly with external validators, if you want to use something like Zod.
Basic Validation
Here's a simple example of a server function that validates the input parameter:

tsx

import { createServerFn } from '@tanstack/start'

type Person = {
  name: string
}

export const greet = createServerFn({ method: 'GET' })
  .validator((person: unknown): Person => {
    if (typeof person !== 'object' || person === null) {
      throw new Error('Person must be an object')
    }

    if ('name' in person && typeof person.name !== 'string') {
      throw new Error('Person.name must be a string')
    }

    return person as Person
  })
  .handler(async ({ data }) => {
    return `Hello, ${data.name}!`
  })
Using a Validation Library
Validation libraries like Zod can be used like so:

tsx

import { createServerFn } from '@tanstack/start'

import { z } from 'zod'

const Person = z.object({
  name: z.string(),
})

export const greet = createServerFn({ method: 'GET' })
  .validator((person: unknown) => {
    return Person.parse(person)
  })
  .handler(async (ctx) => {
    return `Hello, ${ctx.data.name}!`
  })

greet({
  data: {
    name: 'John',
  },
})
Type Safety
Since server-functions cross the network boundary, it's important to ensure the data being passed to them is not only the right type, but also validated at runtime. This is especially important when dealing with user input, as it can be unpredictable. To ensure developers validate their I/O data, types are reliant on validation. The return type of the validator function will be the input to the server function's handler.

tsx

import { createServerFn } from '@tanstack/start'

type Person = {
  name: string
}

export const greet = createServerFn({ method: 'GET' })
  .validator((person: unknown): Person => {
    if (typeof person !== 'object' || person === null) {
      throw new Error('Person must be an object')
    }

    if ('name' in person && typeof person.name !== 'string') {
      throw new Error('Person.name must be a string')
    }

    return person as Person
  })
  .handler(
    async ({
      data, // Person
    }) => {
      return `Hello, ${data.name}!`
    },
  )

function test() {
  greet({ data: { name: 'John' } }) // OK
  greet({ data: { name: 123 } }) // Error: Argument of type '{ name: number; }' is not assignable to parameter of type 'Person'.
}
Inference
Server functions infer their input, and output types based on the input to the validator, and return value of handler functions, respectively. In fact, the validator you define can even have its own separate input/output types, which can be useful if your validator performs transformations on the input data.

To illustrate this, let's take a look at an example using the zod validation library:

tsx

import { createServerFn } from '@tanstack/start'
import { z } from 'zod'

const transactionSchema = z.object({
  amount: z.string().transform((val) => parseInt(val, 10)),
})

const createTransaction = createServerFn()
  .validator(transactionSchema)
  .handler(({ data }) => {
    return data.amount // Returns a number
  })

createTransaction({
  data: {
    amount: '123', // Accepts a string
  },
})
Non-Validated Inference
While we highly recommend using a validation library to validate your network I/O data, you may, for whatever reason not want to validate your data, but still have type safety. To do this, provide type information to the server function using an identity function as the validator, that types the input, and or output to the correct types:

tsx

import { createServerFn } from '@tanstack/start'

type Person = {
  name: string
}

export const greet = createServerFn({ method: 'GET' })
  .validator((d: Person) => d)
  .handler(async (ctx) => {
    return `Hello, ${ctx.data.name}!`
  })

greet({
  data: {
    name: 'John',
  },
})
JSON Parameters
Server functions can accept JSON-serializable objects as parameters. This is useful for passing complex data structures to the server:

tsx

import { createServerFn } from '@tanstack/start'

type Person = {
  name: string
  age: number
}

export const greet = createServerFn({ method: 'GET' })
  .validator((data: Person) => data)
  .handler(async ({ data }) => {
    return `Hello, ${data.name}! You are ${data.age} years old.`
  })

greet({
  data: {
    name: 'John',
    age: 34,
  },
})
FormData Parameters
Server functions can accept FormData objects as parameters

tsx

import { createServerFn } from '@tanstack/start'

export const greetUser = createServerFn()
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data')
    }
    const name = data.get('name')
    const age = data.get('age')

    if (!name || !age) {
      throw new Error('Name and age are required')
    }

    return {
      name: name.toString(),
      age: parseInt(age.toString(), 10),
    }
  })
  .handler(async ({ data: { name, age } }) => {
    return `Hello, ${name}! You are ${age} years old.`
  })

// Usage
function Test() {
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const response = await greetUser({ data: formData })
        console.log(response)
      }}
    >
      <input name="name" />
      <input name="age" />
      <button type="submit">Submit</button>
    </form>
  )
}
Server Function Context
In addition to the single parameter that server functions accept, you can also access server request context from within any server function using utilities from vinxi/http. Under the hood, Vinxi uses unjs's h3 package to perform cross-platform HTTP requests.

There are many context functions available to you for things like:

Accessing the request context
Accessing/setting headers
Accessing/setting sessions/cookies
Setting response status codes and status messages
Dealing with multi-part form data
Reading/Setting custom server context properties
For a full list of available context functions, see all of the available h3 Methods or inspect the Vinxi Exports Source Code.

For starters, here are a few examples:
Accessing the Request Context
Let's use Vinxi's getWebRequest function to access the request itself from within a server function:

tsx

import { createServerFn } from '@tanstack/start'
import { getWebRequest } from 'vinxi/http'

export const getServerTime = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getWebRequest()

    console.log(request.method) // GET

    console.log(request.headers.get('User-Agent')) // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3
  },
)
Accessing Headers
Use Vinxi's getHeaders function to access all headers from within a server function:

tsx

import { createServerFn } from '@tanstack/start'
import { getHeaders } from 'vinxi/http'

export const getServerTime = createServerFn({ method: 'GET' }).handler(
  async () => {
    console.log(getHeaders())
    // {
    //   "accept": "*/*",
    //   "accept-encoding": "gzip, deflate, br",
    //   "accept-language": "en-US,en;q=0.9",
    //   "connection": "keep-alive",
    //   "host": "localhost:3000",
    //   ...
    // }
  },
)
You can also access individual headers using the getHeader function:

tsx

import { createServerFn } from '@tanstack/start'
import { getHeader } from 'vinxi/http'

export const getServerTime = createServerFn({ method: 'GET' }).handler(
  async () => {
    console.log(getHeader('User-Agent')) // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3
  },
)
Returning Values
Server functions can return a few different types of values:

Primitives
JSON-serializable objects
redirect errors (can also be thrown)
notFound errors (can also be thrown)
Raw Response objects
Returning Primitives and JSON
To return any primitive or JSON-serializable object, simply return the value from the server function:

tsx

import { createServerFn } from '@tanstack/start'

export const getServerTime = createServerFn({ method: 'GET' }).handler(
  async () => {
    return new Date().toISOString()
  },
)

export const getServerData = createServerFn({ method: 'GET' }).handler(
  async () => {
    return {
      message: 'Hello, World!',
    }
  },
)
By default, server functions assume that any non-Response object returned is either a primitive or JSON-serializable object.
Responding with Custom Headers
To respond with custom headers, you can use Vinxi's setHeader function:

tsx

import { createServerFn } from '@tanstack/start'
import { setHeader } from 'vinxi/http'

export const getServerTime = createServerFn({ method: 'GET' }).handler(
  async () => {
    setHeader('X-Custom-Header', 'value')
    return new Date().toISOString()
  },
)
Responding with Custom Status Codes
To respond with a custom status code, you can use Vinxi's setResponseStatus function:

tsx

import { createServerFn } from '@tanstack/start'
import { setResponseStatus } from 'vinxi/http'

export const getServerTime = createServerFn({ method: 'GET' }).handler(
  async () => {
    setResponseStatus(201)
    return new Date().toISOString()
  },
)
Returning Raw Response objects
To return a raw Response object, simply return a Response object from the server function:

tsx

import { createServerFn } from '@tanstack/start'

export const getServerTime = createServerFn({ method: 'GET' }).handler(
  async () => {
    // Read a file from s3
    return fetch('https://example.com/time.txt')
  },
)
Throwing Errors
Aside from special redirect and notFound errors, server functions can throw any custom error. These errors will be serialized and sent to the client as a JSON response along with a 500 status code.

tsx

import { createServerFn } from '@tanstack/start'

export const doStuff = createServerFn({ method: 'GET' }).handler(async () => {
  throw new Error('Something went wrong!')
})

// Usage
function Test() {
  try {
    await doStuff()
  } catch (error) {
    console.error(error)
    // {
    //   message: "Something went wrong!",
    //   stack: "Error: Something went wrong!\n    at doStuff (file:///path/to/file.ts:3:3)"
    // }
  }
}
Calling server functions from within route lifecycles
Server functions can be called normally from route loaders, beforeLoads, or any other router-controlled APIs. These APIs are equipped to handle errors, redirects, and notFounds thrown by server functions automatically.

tsx

import { getServerTime } from './getServerTime'

export const Route = createFileRoute('/time')({
  loader: async () => {
    const time = await getServerTime()

    return {
      time,
    }
  },
})
Calling server functions from hooks and components
Server functions can throw redirects or notFounds and while not required, it is recommended to catch these errors and handle them appropriately. To make this easier, the @tanstack/start package exports a useServerFn hook that can be used to bind server functions to components and hooks:

tsx

import { useServerFn } from '@tanstack/start'
import { useQuery } from '@tanstack/react-query'
import { getServerTime } from './getServerTime'

export function Time() {
  const getTime = useServerFn(getServerTime)

  const timeQuery = useQuery({
    queryKey: 'time',
    queryFn: () => getTime(),
  })
}
Calling server functions anywhere else
When using server functions, be aware that redirects and notFounds they throw will only be handled automatically when called from:

Route lifecycles
Components using the useServerFn hook
For other usage locations, you'll need to handle these cases manually.