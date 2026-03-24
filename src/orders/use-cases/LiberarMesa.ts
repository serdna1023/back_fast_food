import { MesaModel } from '@/SequelizeModels'

export class LiberarMesa {
  async execute(mesaId: string): Promise<void> {
    const mesa = await MesaModel.findByPk(mesaId)
    if (!mesa) throw new Error('La mesa no existe')

    // Quitar la redirección
    await MesaModel.update(
      { parentMesaId: null },
      { where: { id: mesaId } }
    )
  }
}
