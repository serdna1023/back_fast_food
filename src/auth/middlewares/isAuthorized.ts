import { Request, Response, NextFunction } from 'express'

export const isAuthorized = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' })
      return
    }

    // El sistema es robusto: si el usuario tiene CUALQUIERA de los permisos requeridos, pasa.
    // Opcionalmente podrías requerir TODOS, pero lo normal en un SaaS es CUALQUIERA.
    const hasPermission = (req.user as any).permissions.some((perm: string) => 
      requiredPermissions.includes(perm)
    )

    if (!hasPermission) {
      res.status(403).json({ 
        error: 'Acceso denegado: No tienes las capacidades necesarias para esta acción',
        required: requiredPermissions
      })
      return
    }

    next()
  }
}
