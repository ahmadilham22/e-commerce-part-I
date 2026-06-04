import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { web } from "../src/app/web.js";
import supertest from "supertest";
import { prismaClient } from "../src/app/database.js";

const request = supertest(web)
describe("Register API /api/auth/signup", () => {
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        email: "test@test.com"
      }
    })
  })
  
  it("Sucessfully registered new user", async () => {
    const testUser = {name: "Test", email: "test@test.com", password: "Rahasia123"}
    const response = await request.post("/api/auth/signup").send(testUser)
    expect(response.status).toBe(201)
  })

  it("Failed register new user", async () => {
    const testUser = {name: "Test", email: "test@test.com", password: "Rahasia123"}
    await request.post("/api/auth/signup").send(testUser)
    const response = await request.post("/api/auth/signup").send(testUser)
    expect(response.status).toBe(400)
    expect(response.body.errors).toBe("Email already exists")
  })

  it("Failed register new user because of empty password", async () => {
    const testUser = { name: "Test", email: "test@test.com" }
    const response = await request.post("/api/auth/signup").send(testUser)
    expect(response.status).toBe(400)
    expect(response.body.errors).toBeDefined()
  })

  it("Failed register new user because of empty data", async () => {
    const testUser = {}
    const response = await request.post("/api/auth/signup").send(testUser)
    expect(response.status).toBe(400)
    expect(response.body.errors).toBeDefined()
  })
})

describe("GET User API /api/users", () => {
  let token

  beforeEach(async () => {
    const testUser = {name: "Test Login", email: "test@test.com", password: "Rahasia123"}
    await request.post("/api/auth/signup").send(testUser)

    const testUserLogin = {email: "test@test.com", password: "Rahasia123"}
    const response = await request.post('/api/auth/signin').send(testUserLogin)
    
    token = response.body.data    
  })

  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        email: "test@test.com"
      }
    })
  })

  it("Successfully get all users", async () => {
    const response = await request.get("/api/users").set("Authorization", `Bearer ${token}`)
    
    expect(response.status).toBe(200)
  })

  it("Failed get users token invalid", async () => {
    const response = await request.get("/api/users").set("Authorization", "Bearer token-invalid")

    expect(response.status).toBe(401)
  })

  it("Failed get users token not found", async () => {
    const response = await request.get("/api/users")

    expect(response.status).toBe(404)
  })
})