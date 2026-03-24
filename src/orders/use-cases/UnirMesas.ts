import { MesaModel } from '@/SequelizeModels'

export class UnirMesas {
  async execute(mesaId: string, parentMesaId: string): Promise<void> {
    if (mesaId === parentMesaId) throw new Error('No puedes unir una mesa a sí misma')
    
    const mesa = await MesaModel.findByPk(mesaId)
    const mesaMaestra = await MesaModel.findByPk(parentMesaId)

    if (!mesa || !mesaMaestra) throw new Error('Una o ambas mesas no existen')

    // Si la mesa maestra ya es hija de otra, unir a la raíz (opcional, para evitar cadenas largas)
    const targetParentId = mesaMaestra.parentMesaId || parentMesaId

    await MesaModel.update(
      { parentMesaId: targetParentId },
      { where: { id: mesaId } }
    )
  }
}
