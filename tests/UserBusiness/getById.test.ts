import { UserBusiness } from "../../src/business/UserBusiness"
import { GetByIdInputDTO, GetByIdOutputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { USER_ROLES } from "../../src/types"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("getById", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("id não existe", async () => {
        try{
            const input: GetByIdInputDTO = {idToFind: "id-mock-inválido"}

            await userBusiness.getById(input)

        } catch (error) {
           if(error instanceof NotFoundError){
              expect(error.message).toBe("'id' não existe")
              expect(error.statusCode).toBe(404)
            }
        }
    })

    test("output", async () => {
        const input: GetByIdInputDTO = {idToFind: "id-mock-normal"}

        const response = await userBusiness.getById(input)

        expect(response.user).toStrictEqual({
            id: "id-mock-normal",
            name: "Normal Mock",
            email: "normal@email.com",
            password: "hash-bananinha",
            createdAt: expect.any(String),
            role: USER_ROLES.NORMAL
        })
    })
})