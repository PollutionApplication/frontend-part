if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/siddhardhakireeti/.gradle/caches/8.14.1/transforms/236c961c1deaa88475c9db351bf3d4e3/transformed/hermes-android-0.80.2-debug/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/siddhardhakireeti/.gradle/caches/8.14.1/transforms/236c961c1deaa88475c9db351bf3d4e3/transformed/hermes-android-0.80.2-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

