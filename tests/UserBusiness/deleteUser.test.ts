import { UserBusiness } from "../../src/business/UserBusiness"
import { DeleteUserInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("delete", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test(" requer token", async () => {
        try{
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock",
                token: null
            }

           await userBusiness.deleteUser(input)

        } catch (error) {
           if(error instanceof BadRequestError){
              expect(error.message).toBe("requer token")
              expect(error.statusCode).toBe(400)
            }
        }
    })

    test("token inválido", async () => {
        try{
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock",
                token: "token-mock-normal-inválido"
            }

           await userBusiness.deleteUser(input)

        } catch (error) {
           if(error instanceof BadRequestError){
              expect(error.message).toBe("token inválido")
              expect(error.statusCode).toBe(400)
            }
        }
    })

    test("somente admins podem deletar contas", async () => {
        try{
            const input: DeleteUserInputDTO = {
                idToDelete: "id-mock",
                token: "token-mock-normal"
            }

           await userBusiness.deleteUser(input)

        } catch (error) {
           if(error instanceof BadRequestError){
              expect(error.message).toBe("somente admins podem deletar contas")
              expect(error.statusCode).toBe(400)
            }
        }
    })

    test("id não existe", async () => {
        try{
            const input: DeleteUserInputDTO = {
                idToDelete: "qualquercoisa",
                token: "token-mock-admin"
            }

           await userBusiness.deleteUser(input)

        } catch (error) {
           if(error instanceof NotFoundError){
              expect(error.message).toBe("'id' não existe")
              expect(error.statusCode).toBe(404)
            }
        }
    })

    test("deve conter uma mensagem de sucesso", async () => {

        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-normal",
            token: "token-mock-admin"
        }

        const result = await userBusiness.deleteUser(input)

        expect(result).toBe("Deletado com sucesso")
    })
})