package com.pgrental.backend.repository;

import com.pgrental.backend.entity.RoomInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoomInventoryRepository extends JpaRepository<RoomInventory, String> {
    Optional<RoomInventory> findByPgIdAndType(String pgId, RoomInventory.RoomType type);
}
