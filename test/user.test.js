import { afterEach, describe, expect, it } from "vitest";
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
  })
})