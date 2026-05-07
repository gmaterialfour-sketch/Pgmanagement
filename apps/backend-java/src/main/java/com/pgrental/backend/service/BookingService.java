package com.pgrental.backend.service;

import com.pgrental.backend.entity.Booking;
import com.pgrental.backend.entity.Pg;
import com.pgrental.backend.entity.RoomInventory;
import com.pgrental.backend.entity.User;
import com.pgrental.backend.repository.BookingRepository;
import com.pgrental.backend.repository.PgRepository;
import com.pgrental.backend.repository.RoomInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final PgRepository pgRepository;
    private final RoomInventoryRepository roomInventoryRepository;

    @Transactional
    public Booking createBooking(User user, String pgId, RoomInventory.RoomType roomType) {
        Pg pg = pgRepository.findById(pgId).orElseThrow(() -> new RuntimeException("PG not found"));
        RoomInventory inventory = roomInventoryRepository.findByPgIdAndType(pgId, roomType)
                .orElseThrow(() -> new RuntimeException("Room type not available for this PG"));

        if (inventory.getOccupied() >= inventory.getTotal()) {
            throw new RuntimeException("No rooms available for this type");
        }

        inventory.setOccupied(inventory.getOccupied() + 1);
        roomInventoryRepository.save(inventory);

        Booking booking = Booking.builder()
                .user(user)
                .pg(pg)
                .roomType(roomType)
                .status(Booking.BookingStatus.CONFIRMED)
                .build();

        return bookingRepository.save(booking);
    }
}
