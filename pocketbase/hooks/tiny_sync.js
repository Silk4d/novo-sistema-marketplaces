routerAdd(
  'POST',
  '/backend/v1/tiny-sync',
  (e) => {
    const body = e.requestInfo().body || {}
    // Attempt to use token from request, fallback to env var
    const token = body.token || $os.getenv('VITE_TINY_TOKEN')

    if (!token) {
      throw new BadRequestError('Token is required for Tiny ERP integration.')
    }

    const url = `https://api.tiny.com.br/api2/produtos.pesquisa.php?token=${token}&formato=json&pesquisa=`

    const res = $http.send({
      url: url,
      method: 'GET',
      timeout: 30,
    })

    // Logging & Visibility (AC requirement)
    console.log('Tiny API Status:', res.statusCode)
    console.log('Tiny API Headers:', JSON.stringify(res.headers))
    console.log('Tiny API Raw JSON:', JSON.stringify(res.json))

    if (res.statusCode !== 200 || !res.json) {
      throw new BadRequestError(`Failed to fetch from Tiny API. HTTP Status: ${res.statusCode}`)
    }

    if (res.json.retorno && res.json.retorno.status === 'Erro') {
      const errorMsg = res.json.retorno.erros?.[0]?.erro || 'Unknown error'
      // Handle empty state gracefully if search returns no records
      if (errorMsg.includes('A pesquisa não retornou registros')) {
        return e.json(200, { read: 0, saved: 0, skipped: 0 })
      }
      throw new BadRequestError(`Tiny API Error: ${errorMsg}`)
    }

    const produtos = res.json.retorno && res.json.retorno.produtos ? res.json.retorno.produtos : []

    let read = 0
    let saved = 0
    let skipped = 0

    for (const item of produtos) {
      read++
      const p = item.produto || {}

      // Filtering Rules: Skip empty/null SKU
      if (!p.codigo || p.codigo.trim() === '') {
        skipped++
        continue
      }

      const sku = p.codigo.trim()

      try {
        let record
        try {
          record = $app.findFirstRecordByData('products', 'sku', sku)
        } catch (_) {
          // Not found, will be created
        }

        if (!record) {
          const collection = $app.findCollectionByNameOrId('products')
          record = new Record(collection)
          record.set('sku', sku)
        }

        // Field Mapping
        record.set('name', p.nome || '')
        record.set('price', Number(p.preco) || 0)
        record.set('cost', Number(p.preco_custo) || 0)
        record.set('gtin', p.gtin || '')
        record.set('status', p.situacao || '')
        record.set('tinyId', String(p.id || ''))

        $app.save(record)
        saved++
      } catch (err) {
        console.error(`Error saving product SKU ${sku}: ${err.message}`)
        skipped++
      }
    }

    return e.json(200, {
      read: read,
      saved: saved,
      skipped: skipped,
    })
  },
  $apis.requireAuth(),
)
