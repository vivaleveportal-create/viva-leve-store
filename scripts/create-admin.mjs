import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import * as readline from 'readline'
import { config } from 'dotenv'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env') })

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function question(q) {
  return new Promise((resolve) => rl.question(q, resolve))
}

async function main() {
  console.log('\n🌿 Criar Admin — Viva Leve Portal\n')

  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('Erro: MONGODB_URI não configurado no .env')
    process.exit(1)
  }

  // Tenta ler do .env primeiro
  let name = process.env.ADMIN_NAME
  let email = process.env.ADMIN_EMAIL
  let password = process.env.ADMIN_PASSWORD

  if (!name) name = await question('Nome do admin: ')
  if (!email) email = await question('Email: ')
  if (!password) password = await question('Senha (mín 8 caracteres): ')

  rl.close()

  if (!name || !email || !password || password.length < 8) {
    console.error('Erro: Dados inválidos ou senha muito curta (mín 8 caracteres).')
    process.exit(1)
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('Conectado ao MongoDB...')
    
    const dbName = process.env.MONGODB_DB_NAME || 'VivaLevePortal'
    const db = client.db(dbName)
    const collection = db.collection('admins')

    const existing = await collection.findOne({ email })
    if (existing) {
      console.error(`\n❌ ERRO: O admin com email "${email}" já existe na base "${dbName}". Operação cancelada.`)
      process.exit(1)
    }

    const hashed = await bcrypt.hash(password, 12)

    await collection.insertOne({
      name,
      email,
      password: hashed,
      role: 'super_admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log(`\n✅ Admin "${name}" criado com sucesso!`)
    console.log(`   Email: ${email}`)
    console.log(`   Nível: super_admin`)
    console.log(`   Base:  ${dbName}`)
    console.log('\nPara acessar: /admin/login\n')
  } catch (error) {
    console.error('\nErro ao criar admin:', error.message)
  } finally {
    await client.close()
  }
}

main().catch(console.error)
