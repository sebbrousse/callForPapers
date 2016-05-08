package io.cfp.utils;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Utils {
    public static String getContent(String path) throws URISyntaxException, IOException {
        return new String(Files.readAllBytes(Paths.get(Utils.class.getResource(path).toURI())));
    }
}
