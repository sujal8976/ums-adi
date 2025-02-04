import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Role from "../models/role";
import User from "../models/user";
import createError from "../utils/createError";

interface PrecedenceUpdate {
  _id: string; // Controller expects "_id"
  precedence: number;
}

interface UpdateRolePrecedencesRequest {
  updates: PrecedenceUpdate[];
}

class RoleController {
  // Create a new role
  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, permissions, createdBy } = req.body;

      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return next(createError(400, "Role with this name already exists"));
      }

      // Get the last precedence number
      const lastPrecedenceRole = await Role.findOne({}).sort({
        precedence: -1,
      });

      const newPrecedence = lastPrecedenceRole
        ? lastPrecedenceRole.precedence + 1
        : 1;

      const role = new Role({
        name,
        precedence: newPrecedence,
        permissions,
        createdBy,
        updatedBy: createdBy,
      });

      await role.save();

      res.status(201).json({
        message: "Role created successfully",
        role,
      });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error creating role",
        ),
      );
    }
  }

  // Delete role and remove it from all users
  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        return next(createError(404, "Role not found"));
      }

      // Get the precedence of the role being deleted
      const deletedPrecedence = role.precedence;

      // Remove role from all users who have it
      await User.updateMany(
        { roles: role.name },
        { $pull: { roles: role.name } },
      );

      // Update precedence of all roles with higher precedence
      await Role.updateMany(
        { precedence: { $gt: deletedPrecedence } },
        { $inc: { precedence: -1 } },
      );

      // Delete the role
      await Role.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: `Role ${role.name} deleted and removed from all users. Precedences updated.`,
      });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error deleting role",
        ),
      );
    }
  }

  // Get all roles sorted by precedence
  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await Role.find({}).sort({ precedence: 1 });
      res.status(200).json({ roles });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error fetching roles",
        ),
      );
    }
  }

  // Get single role by ID
  async getRole(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        return next(createError(404, "Role not found"));
      }
      res.status(200).json({ role });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error fetching role",
        ),
      );
    }
  }

  // Get Roles Array
  async getRolesArray(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await Role.find({})
        .sort({ precedence: 1 })
        .select("_id name precedence");

      res.status(200).json({ roles });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error fetching roles array",
        ),
      );
    }
  }

  // Get combine roles
  async getCombinedRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleNames = req.body.roles;
      if (!Array.isArray(roleNames) || roleNames.length === 0) {
        return next(createError(400, "Please provide an array of role names"));
      }

      const roles = await Role.find({ name: { $in: roleNames } });
      if (roles.length === 0) {
        return next(createError(404, "No roles found"));
      }

      const combinedPermissions: Map<string, Set<string>> = new Map();

      const highestPrecedenceRole = roles.reduce((prev, current) =>
        prev.precedence < current.precedence ? prev : current,
      );

      roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          if (!combinedPermissions.has(permission.page)) {
            combinedPermissions.set(permission.page, new Set());
          }
          permission.actions.forEach((action) => {
            combinedPermissions.get(permission.page)?.add(action);
          });
        });
      });

      const formattedPermissions = Array.from(combinedPermissions).map(
        ([page, actions]) => ({
          page,
          actions: Array.from(actions),
        }),
      );

      res.status(200).json({
        highestRole: highestPrecedenceRole.name,
        highestPrecedence: highestPrecedenceRole.precedence,
        roles: roleNames,
        permissions: formattedPermissions,
      });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error combining roles",
        ),
      );
    }
  }

  // Optional: Add method to fix gaps in precedence if needed
  async reorderPrecedence(req: Request, res: Response, next: NextFunction) {
    try {
      // Get all roles ordered by precedence
      const roles = await Role.find({}).sort({ precedence: 1 });

      // Reassign precedence values to ensure they are sequential
      const updatePromises = roles.map((role, index) => {
        return Role.findByIdAndUpdate(
          role._id,
          { precedence: index + 1 },
          { new: true },
        );
      });

      await Promise.all(updatePromises);

      res.status(200).json({
        message: "Role precedences reordered successfully",
      });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error
            ? error.message
            : "Error reordering precedences",
        ),
      );
    }
  }

  // Bulk update role precedences
  async updateRolePrecedences(req: Request, res: Response, next: NextFunction) {
    try {
      const updates = req.body.updates;

      // Input validation
      if (!Array.isArray(updates) || updates.length === 0) {
        return next(
          createError(
            400,
            "Invalid input: Expected non-empty array of updates",
          ),
        );
      }

      // Clean and validate the data
      const cleanUpdates = updates.map((update) => ({
        _id: String(update._id),
        precedence: Number(update.precedence),
      }));

      // Validate IDs and precedence values
      for (const update of cleanUpdates) {
        if (!mongoose.Types.ObjectId.isValid(update._id)) {
          return next(createError(400, `Invalid ObjectId: ${update._id}`));
        }

        if (isNaN(update.precedence) || update.precedence < 0) {
          return next(
            createError(400, `Invalid precedence value: ${update.precedence}`),
          );
        }
      }

      // Check for duplicate precedence values
      const precedences = cleanUpdates.map((u) => u.precedence);
      if (new Set(precedences).size !== precedences.length) {
        return next(createError(400, "Precedence values must be unique"));
      }

      // Update roles one by one
      const updatePromises = cleanUpdates.map((update) =>
        Role.findByIdAndUpdate(
          update._id,
          { precedence: update.precedence },
          { new: true },
        ),
      );

      const updatedRoles = await Promise.all(updatePromises);

      // Check if any roles were not found
      const nullRoles = updatedRoles.filter((role) => !role);
      if (nullRoles.length > 0) {
        return next(createError(404, "One or more roles not found"));
      }

      res.status(200).json({
        message: "Role precedences updated successfully",
        roles: updatedRoles,
      });
    } catch (error) {
      console.error("Error in updateRolePrecedences:", error);
      next(
        createError(
          500,
          error instanceof Error
            ? error.message
            : "Error updating role precedences",
        ),
      );
    }
  }

  // Update an existing role
  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, permissions, updatedBy } = req.body;
      const roleId = req.params.id;

      // Find the role to update
      const role = await Role.findById(roleId);
      if (!role) {
        return next(createError(404, "Role not found"));
      }

      // If name is being updated, check if new name already exists
      if (name && name !== role.name) {
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
          return next(createError(400, "Role with this name already exists"));
        }

        // Update the role name in all users who have this role
        await User.updateMany(
          { roles: role.name },
          { $set: { "roles.$": name } },
        );
      }

      // Update the role
      const updatedRole = await Role.findByIdAndUpdate(
        roleId,
        {
          ...(name && { name }),
          ...(permissions && { permissions }),
          updatedBy,
          updatedAt: new Date(),
        },
        { new: true },
      );

      res.status(200).json({
        message: "Role updated successfully",
        role: updatedRole,
      });
    } catch (error) {
      next(
        createError(
          500,
          error instanceof Error ? error.message : "Error updating role",
        ),
      );
    }
  }
}

export default new RoleController();
