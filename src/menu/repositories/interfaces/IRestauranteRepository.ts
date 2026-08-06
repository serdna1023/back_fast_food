export interface IRestauranteRepository {
  findBySlug(slug: string): Promise<{ id: string; nombre: string; slug: string } | null>
}
